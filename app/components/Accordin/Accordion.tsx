import { useState } from 'react';

interface AccordionItemProps {
  title: string;
  content: string;
}

export default function Accordion(title, content) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className='accordion-item'>
      <div className='accordion-title' onClick={() => setIsOpen(!isOpen)}>
        {title}
      </div>
      {isOpen && <div className='accordion-content'>{content}</div>}
    </div>
  );
}
