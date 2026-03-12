import './contact.css';
import thum from '../03_thumnails/vlog1_thumnail.jpg';

function Contact() {
  return (
    <div className="contact-page">

      <div className="contact_1">
        <h3 className="contact_txt">bluethingofmine@gmail.com</h3>
        <a
          href="https://github.com/siisat/practice/blob/main/readme/README.md"
          className="contact_txt contact_a"
        >
          Git @siisat
        </a>
      </div>

      <div className="contact_2">
        <a href='http://localhost:3000/Contact' className="thum_link" target="_blank" rel="noopener noreferrer">
          <img src={thum} alt="thumnail" className="thum" /></a>
        <p>@siisat</p>
      </div>
    </div>
  );
}

export default Contact;
