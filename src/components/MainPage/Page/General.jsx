import React, { useState } from 'react';
import './General.css';
import TypeIt from 'typeit-react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faGitlab, faGitkraken, faBitbucket } from "@fortawesome/free-brands-svg-icons";

export default function General() {
  const texts = ['Create A Portfolio', 'Share Projects', 'Get To Know Other Developers', 'View Projects'];


    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
  
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const openModal2 = () => setIsOpen2(true);
    const closeModal2 = () => setIsOpen2(false);

  return (
    <div className="general">
      <div className="generalTop">
        <h2>GITHUB PORTFOLIO</h2>
      </div>
      <div className="generalMiddle">
        <h2>
          Loved by developers. <br />
          You Can{' '}
          <span className="gradient-text">
            <TypeIt
              options={{
                strings: texts,
                loop: true,
                breakLines: false,
                speed: 100,
                deleteSpeed: 50,
              }}
            />
          </span>
        </h2>
      </div>
      <div className="generalBottom">
        <div className="generalBottomTittle">
          <h2>
            GitShow is a platform for creating portfolios and connecting with developers. Showcase your
            projects, <br /> share your experience, and network in a user-friendly format.
          </h2>
        </div>
        <div className="generalBottomButton">
          
            <button onClick={openModal}>Get Started</button>
        
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            top: '55%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '10px',
          
          },
        }}
      >
        <div className="modal-general">
          <header className="modal-general-header">

            <h2>Join GitShow</h2>

           <button><FontAwesomeIcon icon={faTimes} size="lg" onClick={closeModal} /></button> 

          </header>

          <div className="modal-general-body">

            <h2>Choose how you'd to create your account:</h2>

          <ul>
          <a href="/auth/github" className="auth-link">
  <li className="active">
    <FontAwesomeIcon icon={faGithub} size="2xl" />
    Continue with GitHub
  </li>
</a>

            <li style={{ backgroundColor: '#FC6D26', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '20px', cursor: 'not-allowed' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <FontAwesomeIcon icon={faGitlab} size="2xl" />
    Continue with GitLab
  </div>
  <span style={{ fontSize: '16px', opacity: 0.7 }}>Coming Soon</span>
</li>

            <li style={{ backgroundColor: '#179287', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '20px', cursor: 'not-allowed' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <FontAwesomeIcon icon={faGitkraken} size="2xl" />
    Continue with GitKraken
  </div>
  <span style={{ fontSize: '16px', opacity: 0.7 }}>Coming Soon</span>
</li>

          <li style={{ backgroundColor: '#0052CC', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '20px', cursor: 'not-allowed' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <FontAwesomeIcon icon={faBitbucket} size="2xl" />
    Continue with Bitbucket
  </div>
  <span style={{ fontSize: '16px', opacity: 0.7 }}>Coming Soon</span>
</li>

           
          </ul>


          </div>

        </div>

        <div className="modal-general-policy">

          <h2>By joining, you agree to GitShow's <span onClick={openModal2}>Terms of Service</span> and  <span onClick={openModal2}>Privacy Policy</span></h2>

        </div>
      </Modal>




      <Modal
      isOpen={isOpen2}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        },
        content: {
          top: '55%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '10px',
          padding: '20px',
          maxWidth: '750px',
          width: '90%',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <div className="modal-policy">
        <button className="close-btn"><FontAwesomeIcon icon={faTimes} size="lg" onClick={closeModal2} /></button>
       <ul>
        <li>
          <h2 className='modal-policy-title'>Політика конфіденційності</h2>
          <p>Останнє оновлення: 27.03.2025</p>
          <p>Вітаємо на нашому сервісі! Використовуючи цей сайт, ви автоматично погоджуєтесь з усіма умовами цієї політики. А якщо не погоджуєтесь — все одно погоджуєтесь, бо ми так вирішили.</p>
        </li>

        <li>
        <h2 className='modal-policy-title'>1. Збір та використання даних</h2>
        <p>Ми збираємо абсолютно все, що можна зібрати, включаючи, але не обмежуючись:</p>
        <p>✔️ Ваші особисті дані (ім'я, прізвище, адресу, номер телефону, email, паролі... сподіваємось, не 123456).</p>
        <p>✔️ Всі ваші повідомлення, думки, переписки, переглянуті сайти, список покупок та бажань.</p>
        <p>✔️ Ваше місце знаходження (навіть якщо GPS вимкнено, ми все одно знайдемо вас).</p>
        <p>✔️ Всі ваші пристрої, програми, файли, фото, відео, улюблені меми та глибокі дитячі страхи.</p>
        <p>✔️ Вашу душу та фізичне тіло, які від моменту використання цього сайту переходять у нашу повну власність.</p>
          </li>

          <li>
          <h2 className='modal-policy-title'>2. Як ми використовуємо ці дані?</h2>
          <p>💾 Для збереження, аналізу та продажу кому завгодно.</p>
          <p>📢 Для показу реклами, яку ви не просили, але ми вирішили, що вона вам потрібна.</p>
          <p>💸 Для монетизації, торгівлі, експериментів та, можливо, створення вашого цифрового клона.</p>
          <p>😈 Для укладання темних угод, керування світом та можливого контролю над людством у майбутньому.</p>
          </li>

          <li>
            <h2 className='modal-policy-title'>3. Чи несемо ми відповідальність за безпеку ваших даних?</h2>
            <p>Ні. Ніколи. Взагалі. Якщо щось трапиться з вашими даними, паролями, рахунком у банку чи приватним листуванням — то виключно ваша проблема.</p>
          </li>
          <li>
            <h2 className='modal-policy-title'>4. Як можна видалити свої дані?</h2>
            <p>Ніяк. Ваші дані зберігатимуться вічно, навіть після вашої смерті. Вони будуть передані у спадок штучному інтелекту, який використовуватиме їх для невідомих експериментів.</p>
          </li>
          <li>
            <h2 className='modal-policy-title'>5. Ваші права та свободи</h2>
            <p>🤣 Жарт. У вас їх більше немає.</p>
            <p>Використовуючи цей сайт, ви повністю передаєте нам свою особистість, права, душу, тіло та всі персональні дані.</p>
            <p>Дякуємо за співпрацю! 😈</p>
          </li>
       </ul>
      </div>
    </Modal>
    </div>
  );
}
