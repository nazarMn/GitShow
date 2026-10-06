import React, { useState } from 'react';
import TypeIt from 'typeit-react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faGitlab, faGitkraken, faBitbucket } from "@fortawesome/free-brands-svg-icons";
import { tw } from '@/shared/lib/tailwind';


export default function General() {
  const texts = ['Create A Portfolio', 'Share Projects', 'Get To Know Other Developers', 'View Projects'];


    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const openModal2 = () => setIsOpen2(true);
    const closeModal2 = () => setIsOpen2(false);

  return (
    <div className={tw("general max-lg:h-auto max-lg:min-h-[86vh] max-lg:justify-start max-lg:px-6")}>
      <div className={tw("generalTop max-lg:h-auto max-lg:min-h-[8vh] max-lg:items-end")}>
        <h2>GITHUB PORTFOLIO</h2>
      </div>
      <div className={tw("generalMiddle max-lg:h-auto max-lg:items-start max-lg:py-3")}>
        <h2 className={tw("max-lg:!text-[clamp(2.25rem,8vw,4rem)] max-lg:!leading-[1.1] break-words")}>
          Loved by developers. <br />
          You Can{' '}
          <TypeIt
              className={tw("gradient-text bg-clip-text")}
              options={{
                strings: texts,
                loop: true,
                breakLines: false,
                speed: 100,
                deleteSpeed: 50,
              }}
            />
        </h2>
      </div>
      <div className={tw("generalBottom max-lg:h-auto max-lg:pt-4")}>
        <div className={tw("generalBottomTittle max-lg:h-auto")}>
          <h2 className={tw("max-lg:!text-[clamp(1rem,2.5vw,1.5rem)] max-lg:!leading-[1.5] max-lg:!tracking-normal break-words")}>
            GitShow is a platform for creating portfolios and connecting with developers. Showcase your
            projects, <br /> share your experience, and network in a user-friendly format.
          </h2>
        </div>
        <div className={tw("generalBottomButton max-lg:h-auto max-lg:pt-8 max-lg:pb-6")}>

            <button onClick={openModal}>Get Started</button>

        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => {}}
        className={tw('absolute top-[55%] left-1/2 right-auto bottom-auto mr-[-50%] translate-x-[-50%] translate-y-[-50%] rounded-[10px] border border-[#ccc] bg-white overflow-auto outline-none p-[20px] [-webkit-overflow-scrolling:touch]')}
        overlayClassName={tw('fixed inset-0 bg-[rgba(0,0,0,0.5)]')}
      >
        <div className={tw("modal-general")}>
          <header className={tw("modal-general-header")}>

            <h2>Join GitShow</h2>

           <button><FontAwesomeIcon icon={faTimes} size="lg" onClick={closeModal} /></button>

          </header>

          <div className={tw("modal-general-body")}>

            <h2>Choose how you'd to create your account:</h2>

          <ul>
          <a href="/auth/github" className={tw("auth-link")}>
  <li className={tw("active")}>
    <FontAwesomeIcon icon={faGithub} size="2xl" />
    Continue with GitHub
  </li>
</a>

            <li className={tw('flex items-center justify-between pr-[20px] cursor-not-allowed bg-[#FC6D26]')}>
  <div className={tw('flex items-center gap-[10px]')}>
    <FontAwesomeIcon icon={faGitlab} size="2xl" />
    Continue with GitLab
  </div>
  <span className={tw('text-[16px] opacity-70')}>Coming Soon</span>
</li>

            <li className={tw('flex items-center justify-between pr-[20px] cursor-not-allowed bg-[#179287]')}>
  <div className={tw('flex items-center gap-[10px]')}>
    <FontAwesomeIcon icon={faGitkraken} size="2xl" />
    Continue with GitKraken
  </div>
  <span className={tw('text-[16px] opacity-70')}>Coming Soon</span>
</li>

          <li className={tw('flex items-center justify-between pr-[20px] cursor-not-allowed bg-[#0052CC]')}>
  <div className={tw('flex items-center gap-[10px]')}>
    <FontAwesomeIcon icon={faBitbucket} size="2xl" />
    Continue with Bitbucket
  </div>
  <span className={tw('text-[16px] opacity-70')}>Coming Soon</span>
</li>


          </ul>


          </div>

        </div>

        <div className={tw("modal-general-policy")}>

          <h2>By joining, you agree to GitShow's <span onClick={openModal2}>Terms of Service</span> and  <span onClick={openModal2}>Privacy Policy</span></h2>

        </div>
      </Modal>




      <Modal
      isOpen={isOpen2}
      className={tw('absolute top-[55%] left-1/2 right-auto bottom-auto mr-[-50%] translate-x-[-50%] translate-y-[-50%] rounded-[10px] border border-[#ccc] bg-white overflow-auto outline-none p-[20px] [-webkit-overflow-scrolling:touch] max-w-[750px] w-[90%] shadow-[0_4px_10px_rgba(0,0,0,0.3)]')}
      overlayClassName={tw('fixed inset-0 z-[1000] bg-[rgba(0,0,0,0.5)]')}
    >
      <div className={tw("modal-policy")}>
        <button className={tw("close-btn")}><FontAwesomeIcon icon={faTimes} size="lg" onClick={closeModal2} /></button>
       <ul>
        <li>
          <h2 className={tw("modal-policy-title")}>Політика конфіденційності</h2>
          <p>Останнє оновлення: 27.03.2025</p>
          <p>Вітаємо на нашому сервісі! Використовуючи цей сайт, ви автоматично погоджуєтесь з усіма умовами цієї політики. А якщо не погоджуєтесь — все одно погоджуєтесь, бо ми так вирішили.</p>
        </li>

        <li>
        <h2 className={tw("modal-policy-title")}>1. Збір та використання даних</h2>
        <p>Ми збираємо абсолютно все, що можна зібрати, включаючи, але не обмежуючись:</p>
        <p>✔️ Ваші особисті дані (ім'я, прізвище, адресу, номер телефону, email, паролі... сподіваємось, не 123456).</p>
        <p>✔️ Всі ваші повідомлення, думки, переписки, переглянуті сайти, список покупок та бажань.</p>
        <p>✔️ Ваше місце знаходження (навіть якщо GPS вимкнено, ми все одно знайдемо вас).</p>
        <p>✔️ Всі ваші пристрої, програми, файли, фото, відео, улюблені меми та глибокі дитячі страхи.</p>
        <p>✔️ Вашу душу та фізичне тіло, які від моменту використання цього сайту переходять у нашу повну власність.</p>
          </li>

          <li>
          <h2 className={tw("modal-policy-title")}>2. Як ми використовуємо ці дані?</h2>
          <p>💾 Для збереження, аналізу та продажу кому завгодно.</p>
          <p>📢 Для показу реклами, яку ви не просили, але ми вирішили, що вона вам потрібна.</p>
          <p>💸 Для монетизації, торгівлі, експериментів та, можливо, створення вашого цифрового клона.</p>
          <p>😈 Для укладання темних угод, керування світом та можливого контролю над людством у майбутньому.</p>
          </li>

          <li>
            <h2 className={tw("modal-policy-title")}>3. Чи несемо ми відповідальність за безпеку ваших даних?</h2>
            <p>Ні. Ніколи. Взагалі. Якщо щось трапиться з вашими даними, паролями, рахунком у банку чи приватним листуванням — то виключно ваша проблема.</p>
          </li>
          <li>
            <h2 className={tw("modal-policy-title")}>4. Як можна видалити свої дані?</h2>
            <p>Ніяк. Ваші дані зберігатимуться вічно, навіть після вашої смерті. Вони будуть передані у спадок штучному інтелекту, який використовуватиме їх для невідомих експериментів.</p>
          </li>
          <li>
            <h2 className={tw("modal-policy-title")}>5. Ваші права та свободи</h2>
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
