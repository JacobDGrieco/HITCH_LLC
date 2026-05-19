import { useState, useEffect } from 'react';
import '../../styles/speech-bubble.css';

const TAGLINES = [
  "I build things that feel finished.",
  "Full-stack developer. CS @ UK.",
  "React · FastAPI · PostgreSQL",
  "Let's build something.",
];

export default function SpeechBubble() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % TAGLINES.length);
        setVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="speech-bubble">
      <div className={`speech-bubble__text${visible ? '' : ' speech-bubble__text--hidden'}`}>
        {TAGLINES[index]}
      </div>
      <div className="speech-bubble__tail" />
    </div>
  );
}
