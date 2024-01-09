import ChatComponent from '@/app/components/Chat/ChatComponent';

export default function pianoPage() {
  return (
    <div className="piano">
      <div className="white-keys">
        <div className="white-key"></div>
        <div className="white-key"></div>
        <div className="white-key"></div>
        <div className="white-key"></div>
        <div className="white-key"></div>
        <div className="white-key"></div>
        <div className="white-key"></div>
      </div>
      <div className="black-keys">
        <div className="black-key"></div>
        <div className="black-key"></div>
        <div className="black-key"></div>
        <div className="black-key"></div>
        <div className="black-key"></div>
      </div>
    </div>
  );
}
