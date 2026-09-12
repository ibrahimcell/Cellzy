#!/usr/bin/env swift
// Offline, deterministic isolation of Apple's original three-second Duo film.
// This creates no device imagery: only its border-connected white backdrop is
// identified. Enclosed whites (clock, screen UI, reflections) remain untouched.
// Run from the repository root:
//   swiftc -O scripts/prepare-duo-mattes.swift -o /private/tmp/cellzy-duo-mattes
//   /private/tmp/cellzy-duo-mattes
import Foundation
import AVFoundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

struct Point: Equatable { let x: Double; let y: Double }
struct MatteFrame: Codable {
    let time: Double
    let path: String
    let bounds: [Int]
}
struct MatteManifest: Codable {
    let version: Int
    let source: String
    let width: Int
    let height: Int
    let duration: Double
    let frames: [MatteFrame]
}
struct PreparedFrame {
    let time: Double
    let rgba: [UInt8]
    let path: CGPath
}

enum PreparationError: Error { case invalidVideo, decodingFailed, missingContour, imageFailed }

func distance(_ point: Point, _ start: Point, _ end: Point) -> Double {
    let dx = end.x - start.x, dy = end.y - start.y
    if dx == 0 && dy == 0 { return hypot(point.x - start.x, point.y - start.y) }
    let t = max(0, min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)))
    return hypot(point.x - start.x - t * dx, point.y - start.y - t * dy)
}

func simplify(_ points: [Point], tolerance: Double) -> [Point] {
    guard points.count > 2 else { return points }
    var greatest = 0.0, split = 0
    for index in 1..<(points.count - 1) {
        let candidate = distance(points[index], points[0], points[points.count - 1])
        if candidate > greatest { greatest = candidate; split = index }
    }
    guard greatest > tolerance else { return [points[0], points[points.count - 1]] }
    return Array(simplify(Array(points[0...split]), tolerance: tolerance).dropLast())
        + simplify(Array(points[split...]), tolerance: tolerance)
}

// Only flood the outside. A white time, UI icon, or reflection enclosed by the
// phone's frame cannot be reached and therefore cannot accidentally disappear.
func exteriorWhite(_ rgba: [UInt8], width: Int, height: Int) -> [Bool] {
    let count = width * height
    var outside = [Bool](repeating: false, count: count)
    var queue = [Int](); queue.reserveCapacity(count)
    func isWhite(_ index: Int) -> Bool {
        let offset = index * 4
        return min(rgba[offset], rgba[offset + 1], rgba[offset + 2]) >= 248
    }
    func enqueue(_ index: Int) {
        if !outside[index] && isWhite(index) { outside[index] = true; queue.append(index) }
    }
    for x in 0..<width { enqueue(x); enqueue((height - 1) * width + x) }
    for y in 0..<height { enqueue(y * width); enqueue(y * width + width - 1) }
    var cursor = 0
    while cursor < queue.count {
        let index = queue[cursor]; cursor += 1
        let x = index % width, y = index / width
        if x > 0 { enqueue(index - 1) }
        if x < width - 1 { enqueue(index + 1) }
        if y > 0 { enqueue(index - width) }
        if y < height - 1 { enqueue(index + width) }
    }
    return outside
}

func silhouette(_ outside: [Bool], width: Int, height: Int) throws -> ([Point], [Int]) {
    // Trace pixel-cell exterior edges, then simplify by at most 0.4 source px.
    // An opaque phone is one contiguous silhouette. Tiny detached JPEG/H.264
    // ringing components are not part of the product and are discarded.
    let stride = width + 1
    var edges = [Int: [Int]]()
    func add(_ x1: Int, _ y1: Int, _ x2: Int, _ y2: Int) {
        edges[y1 * stride + x1, default: []].append(y2 * stride + x2)
    }
    for y in 0..<height {
        for x in 0..<width where !outside[y * width + x] {
            let index = y * width + x
            if y == 0 || outside[index - width] { add(x, y, x + 1, y) }
            if x == width - 1 || outside[index + 1] { add(x + 1, y, x + 1, y + 1) }
            if y == height - 1 || outside[index + width] { add(x + 1, y + 1, x, y + 1) }
            if x == 0 || outside[index - 1] { add(x, y + 1, x, y) }
        }
    }
    var largest = [Point](), largestArea = 0.0
    while let start = edges.keys.min() {
        var vertex = start, points = [Point](), closed = false
        repeat {
            points.append(Point(x: Double(vertex % stride), y: Double(vertex / stride)))
            guard var candidates = edges[vertex], !candidates.isEmpty else { break }
            let next = candidates.removeLast()
            if candidates.isEmpty { edges.removeValue(forKey: vertex) } else { edges[vertex] = candidates }
            vertex = next
            if vertex == start { closed = true }
        } while !closed
        if closed && points.count > 3 {
            var area = 0.0
            for i in points.indices {
                let a = points[i], b = points[(i + 1) % points.count]
                area += a.x * b.y - b.x * a.y
            }
            if abs(area) > largestArea { largestArea = abs(area); largest = points }
        }
    }
    guard !largest.isEmpty else { throw PreparationError.missingContour }
    let minX = Int(largest.map(\.x).min()!), maxX = Int(largest.map(\.x).max()!)
    let minY = Int(largest.map(\.y).min()!), maxY = Int(largest.map(\.y).max()!)
    // Split a closed ring into two open polylines so RDP has distinct endpoints.
    let split = largest.count / 2
    let first = simplify(Array(largest[0...split]), tolerance: 0.4)
    let second = simplify(Array(largest[split...]) + [largest[0]], tolerance: 0.4)
    return (Array(first.dropLast()) + Array(second.dropLast()), [minX, minY, maxX - minX, maxY - minY])
}

func cgPath(_ points: [Point]) -> CGPath {
    let path = CGMutablePath()
    path.move(to: CGPoint(x: points[0].x, y: points[0].y))
    for point in points.dropFirst() { path.addLine(to: CGPoint(x: point.x, y: point.y)) }
    path.closeSubpath()
    return path
}

func transparentImage(_ frame: PreparedFrame, width: Int, height: Int) throws -> CGImage {
    // Supersampled coverage is computed offline, never in the browser. It keeps
    // rounded edges clean while the opaque device RGB remains byte-for-byte.
    var result = frame.rgba
    for y in 0..<height {
        for x in 0..<width {
            var coverage = 0
            for dy in [0.25, 0.75] {
                for dx in [0.25, 0.75] {
                    if frame.path.contains(CGPoint(x: Double(x) + dx, y: Double(y) + dy)) { coverage += 1 }
                }
            }
            let offset = (y * width + x) * 4
            result[offset + 3] = UInt8(coverage * 255 / 4)
        }
    }
    let data = Data(result) as CFData
    guard let provider = CGDataProvider(data: data),
          let image = CGImage(width: width, height: height, bitsPerComponent: 8,
                              bitsPerPixel: 32, bytesPerRow: width * 4,
                              space: CGColorSpace(name: CGColorSpace.sRGB)!,
                              bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.last.rawValue),
                              provider: provider, decode: nil, shouldInterpolate: true, intent: .defaultIntent)
    else { throw PreparationError.imageFailed }
    return image
}

func writePNG(_ image: CGImage, to url: URL) throws {
    guard let destination = CGImageDestinationCreateWithURL(url as CFURL, UTType.png.identifier as CFString, 1, nil)
    else { throw PreparationError.imageFailed }
    CGImageDestinationAddImage(destination, image, nil)
    guard CGImageDestinationFinalize(destination) else { throw PreparationError.imageFailed }
}

func main() async throws {
    let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
    let output = root.appendingPathComponent("public/assets/products/duo")
    let source = output.appendingPathComponent("apple-highlights-display.mp4")
    let asset = AVURLAsset(url: source)
    guard let track = try await asset.loadTracks(withMediaType: .video).first else { throw PreparationError.invalidVideo }
    let (size, transform) = try await track.load(.naturalSize, .preferredTransform)
    let duration = try await asset.load(.duration).seconds
    let width = Int(size.width), height = Int(size.height)
    guard width == 1260, height == 612, transform == .identity else { throw PreparationError.invalidVideo }
    let reader = try AVAssetReader(asset: asset)
    let readerOutput = AVAssetReaderTrackOutput(track: track, outputSettings: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
    ])
    readerOutput.alwaysCopiesSampleData = false
    reader.add(readerOutput)
    guard reader.startReading() else { throw reader.error ?? PreparationError.decodingFailed }
    var frames = [MatteFrame](), selected = [Int: PreparedFrame]()
    var last: PreparedFrame?
    while let sample = readerOutput.copyNextSampleBuffer() {
        guard let buffer = CMSampleBufferGetImageBuffer(sample) else { continue }
        CVPixelBufferLockBaseAddress(buffer, .readOnly)
        guard let base = CVPixelBufferGetBaseAddress(buffer) else { throw PreparationError.decodingFailed }
        let bytes = base.assumingMemoryBound(to: UInt8.self)
        let stride = CVPixelBufferGetBytesPerRow(buffer)
        var rgba = [UInt8](repeating: 255, count: width * height * 4)
        for y in 0..<height {
            for x in 0..<width {
                let input = y * stride + x * 4, target = (y * width + x) * 4
                rgba[target] = bytes[input + 2]
                rgba[target + 1] = bytes[input + 1]
                rgba[target + 2] = bytes[input]
            }
        }
        CVPixelBufferUnlockBaseAddress(buffer, .readOnly)
        let time = CMSampleBufferGetPresentationTimeStamp(sample).seconds
        let outside = exteriorWhite(rgba, width: width, height: height)
        let (points, bounds) = try silhouette(outside, width: width, height: height)
        let pathString = "M" + points.map { "\(Int($0.x)) \(Int($0.y))" }.joined(separator: "L") + "Z"
        frames.append(MatteFrame(time: (time * 1_000_000).rounded() / 1_000_000, path: pathString, bounds: bounds))
        let prepared = PreparedFrame(time: time, rgba: rgba, path: cgPath(points))
        if frames.count == 1 || frames.count == 46 { selected[frames.count] = prepared }
        last = prepared
    }
    guard reader.status == .completed, let first = selected[1], let last else {
        throw reader.error ?? PreparationError.decodingFailed
    }
    let manifest = MatteManifest(version: 1, source: "apple-highlights-display.mp4", width: width, height: height,
                                 duration: duration, frames: frames)
    let encoder = JSONEncoder(); encoder.outputFormatting = [.sortedKeys, .withoutEscapingSlashes]
    let json = try encoder.encode(manifest)
    try json.write(to: output.appendingPathComponent("duo-mattes.json"), options: .atomic)
    let firstImage = try transparentImage(first, width: width, height: height)
    let lastImage = try transparentImage(last, width: width, height: height)
    try writePNG(firstImage, to: output.appendingPathComponent("duo-transparent-start.png"))
    try writePNG(lastImage, to: output.appendingPathComponent("duo-transparent-end.png"))
    // Diagnostic artifacts are ignored by git and are not delivered as assets.
    let review = root.appendingPathComponent("output/playwright")
    try FileManager.default.createDirectory(at: review, withIntermediateDirectories: true)
    if let middle = selected[46] {
        let middleImage = try transparentImage(middle, width: width, height: height)
        try writePNG(middleImage, to: review.appendingPathComponent("duo-mask-mid-transparent.png"))
        let reviewWidth = width * 3 / 2, reviewHeight = height
        guard let context = CGContext(data: nil, width: reviewWidth, height: reviewHeight,
                                      bitsPerComponent: 8, bytesPerRow: reviewWidth * 4,
                                      space: CGColorSpace(name: CGColorSpace.sRGB)!,
                                      bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)
        else { throw PreparationError.imageFailed }
        for (row, rgb) in [[255.0, 243.0, 223.0], [201.0, 74.0, 43.0]].enumerated() {
            let y = Double(row * height / 2)
            context.setFillColor(CGColor(red: rgb[0] / 255, green: rgb[1] / 255, blue: rgb[2] / 255, alpha: 1))
            context.fill(CGRect(x: 0, y: y, width: Double(reviewWidth), height: Double(height / 2)))
            for (column, image) in [firstImage, middleImage, lastImage].enumerated() {
                context.draw(image, in: CGRect(x: column * width / 2, y: row * height / 2, width: width / 2, height: height / 2))
            }
        }
        guard let reviewImage = context.makeImage() else { throw PreparationError.imageFailed }
        try writePNG(reviewImage, to: review.appendingPathComponent("duo-mask-color-review.png"))
    }
    print("Prepared \(frames.count) exact presentation-time masks (\(json.count) bytes), \(width)×\(height), duration \(duration)s.")
    print("First silhouette \(frames.first!.bounds); last silhouette \(frames.last!.bounds).")
}

do { try await main() } catch { fputs("Duo matte preparation failed: \(error)\n", stderr); exit(1) }
