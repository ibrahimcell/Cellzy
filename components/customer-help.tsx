import { ChevronDown } from "lucide-react";
import { CONTACT_EMAIL, inquiryLink } from "@/lib/repairs";
import styles from "./customer-help.module.css";

const questions = [
  {
    question: "How do I get a repair quote?",
    answer: "Find your phone, select the issue and choose Email for a quote. Your email will include those details. The price depends on your model, the damage and the parts available, so we’ll confirm your options before the repair.",
  },
  {
    question: "Which replacement screen should I choose?",
    answer: "You can request LCD, OLED or Original when booking a cracked-screen repair. Not sure? Select Help me choose. The options and prices vary by model, and we’ll confirm what’s available for your phone.",
  },
  {
    question: "Will my repair take 30 minutes?",
    answer: "Most standard repairs take around 30 minutes. The condition of your phone, the work needed and parts availability can affect that. Include any other damage in your request so we can give you a clearer idea of the timing.",
  },
  {
    question: "Is my appointment confirmed when I choose a date?",
    answer: "Not yet. The calendar lets you request a preferred date and time; it does not show live availability. Prepare your email, review it and send it. Your appointment is confirmed only when Cellzy replies with a time.",
  },
  {
    question: "What if my model or issue isn’t listed?",
    answer: "Type your exact model and use it even if it isn’t in the results. If you’re unsure about the problem, choose Software or other and describe what you notice. For several problems, select the main one and list the rest in the notes.",
  },
  {
    question: "Can I walk in without an appointment?",
    answer: "Walk-ins are welcome. To check parts, get a quote or ask about a preferred visit time beforehand, send us a request. We’ll confirm the details by email before you make the trip.",
  },
  {
    question: "Can I reserve a phone or accessory without paying online?",
    answer: "Yes. Send an inquiry with the phone model, preferred storage and colour, or the accessory you’re looking for. Include the exact phone model for cases and screen protectors. No payment is collected on this site; we’ll reply with price, availability and reservation details.",
  },
  {
    question: "What should I do before bringing my phone in?",
    answer: "Back up your phone if you can, and note anything you want us to check. If the phone won’t turn on or you can’t make a backup, mention that in your request. Don’t include device passcodes, account passwords or payment details in your email.",
  },
] as const;

export function CustomerHelp() {
  return (
    <section className={styles.section} id="questions" aria-labelledby="customer-help-title">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <h2 id="customer-help-title">A little clarity.<br />Before you visit.</h2>
          <p className={styles.description}>A few answers now. One less thing to think about when your phone needs care.</p>
          <ol className={styles.steps} aria-label="How a repair request works">
            <li><strong>Tell us what you need.</strong><p>Choose your phone, the repair and a preferred visit.</p></li>
            <li><strong>Send your prepared email.</strong><p>Review the details in your email app, then send them to us.</p></li>
            <li><strong>Wait for our confirmation.</strong><p>We’ll reply with pricing, parts and an appointment time.</p></li>
          </ol>
          <div className={styles.contact}>
            <p>Something else on your mind?</p>
            <a href={inquiryLink("A question for Cellzy", ["Phone model:", "My question:"])}>{CONTACT_EMAIL}</a>
          </div>
        </div>
        <div className={styles.questions}>
          {questions.map(({ question, answer }) => (
            <details className={styles.item} key={question}>
              <summary><span>{question}</span><ChevronDown aria-hidden="true" /></summary>
              <div className={styles.answer}><p>{answer}</p></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
