import TextTrail from '../components/TextTrail'; 

function Contact() {
  return (
    <div className="main">
      {/* 마우스 따라 텍스트 트레일 */}
      <TextTrail 
        text="Hello!"           // 내용
        trailTime={4}     // 지속 시간
        count={100}
      />
    </div>
  );
}

export default Contact;