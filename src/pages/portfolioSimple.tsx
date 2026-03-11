import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Portfolio.module.css";
import profileImg from "../assets/profile/Joelysom.jfif";
import MeteorShower from "../components/MeteorShower";

const PortfolioSimple: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>

      <MeteorShower />

      <div className={styles.backgroundGlow}></div>

      <header className={styles.hero}>

        <button 
          onClick={() => navigate("/")} 
          className={styles.backButton}
        >
          ← Voltar
        </button>

        <img
          src={profileImg}
          alt="Joelysom"
          className={styles.profile}
        />

        <h1 className={styles.name}>
          Joelysom Alcantara
        </h1>

        <p className={styles.title}>
          Desenvolvedor Full Stack • Técnico em TI • React & Python
        </p>

        <p className={styles.location}>
          📍 Recife – PE | 📱 (81) 9888-72515
        </p>

        <div className={styles.links}>
          <a href="https://github.com/joelysom" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>

          <a href="mailto:joelysomalcantaradasilva@gmail.com">
            Email
          </a>
        </div>

      </header>

      <section className={styles.card}>
        <h2 className={styles.cardH2}>Sobre</h2>

        <p className={styles.cardP}>
          Técnico em Computação e Tecnólogo em Tecnologia da Informação com experiência prática em suporte técnico, desenvolvimento web e análise de dados. Atuação focada na resolução de problemas, organização de demandas técnicas e comunicação clara com clientes. Cursando Análise e Desenvolvimento de Sistemas com habilidades em Python, Django, JavaScript, React e SQLite.
        </p>

      </section>

      <section className={styles.card}>
        <h2 className={styles.cardH2}>Competências Técnicas</h2>
        
        <div className={styles.competenceGroup}>
          <h3 className={styles.subTitle}>Linguagens:</h3>
          <div className={styles.skills}>
            <span className={styles.skillsSpan}>Python</span>
            <span className={styles.skillsSpan}>JavaScript</span>
            <span className={styles.skillsSpan}>TypeScript</span>
            <span className={styles.skillsSpan}>SQL</span>
            <span className={styles.skillsSpan}>HTML</span>
            <span className={styles.skillsSpan}>CSS</span>
          </div>
        </div>

        <div className={styles.competenceGroup}>
          <h3 className={styles.subTitle}>Frameworks & Ferramentas:</h3>
          <div className={styles.skills}>
            <span className={styles.skillsSpan}>React</span>
            <span className={styles.skillsSpan}>Django</span>
            <span className={styles.skillsSpan}>Firebase</span>
            <span className={styles.skillsSpan}>SQLite</span>
            <span className={styles.skillsSpan}>Git</span>
            <span className={styles.skillsSpan}>GitHub</span>
          </div>
        </div>

        <div className={styles.competenceGroup}>
          <h3 className={styles.subTitle}>Áreas de Expertise:</h3>
          <div className={styles.skills}>
            <span className={styles.skillsSpan}>Suporte Técnico</span>
            <span className={styles.skillsSpan}>Desenvolvimento Web</span>
            <span className={styles.skillsSpan}>Análise de Dados</span>
            <span className={styles.skillsSpan}>Help Desk</span>
            <span className={styles.skillsSpan}>Lógica de Programação</span>
            <span className={styles.skillsSpan}>SCRUM</span>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardH2}>Experiência Profissional</h2>

        <div className={styles.experienceItem}>
          <h3 className={styles.expTitle}>Manutenção e Limpeza de Computadores</h3>
          <p className={styles.expPeriod}>2024 – 2025</p>
          <ul className={styles.cardUl}>
            <li className={styles.cardLi}>Manutenção preventiva e corretiva em computadores e notebooks</li>
            <li className={styles.cardLi}>Formatação e configuração de sistemas operacionais</li>
            <li className={styles.cardLi}>Diagnóstico técnico de falhas e resolução de problemas</li>
            <li className={styles.cardLi}>Atendimento e suporte ao usuário final</li>
            <li className={styles.cardLi}>Organização e controle de demandas técnicas</li>
          </ul>
        </div>

        <div className={styles.experienceItem}>
          <h3 className={styles.expTitle}>Atendente - VLM Acessórias</h3>
          <p className={styles.expPeriod}>2021 – 2022</p>
          <ul className={styles.cardUl}>
            <li className={styles.cardLi}>Atendimento ao cliente em processos de cobrança e negociação</li>
            <li className={styles.cardLi}>Análise e controle de dados internos</li>
            <li className={styles.cardLi}>Suporte às atividades administrativas</li>
          </ul>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardH2}>Projetos Relevantes</h2>

        <div className={styles.projectItem}>
          <h3 className={styles.projectTitle}>🎮 GameFLIX</h3>
          <p className={styles.projectDesc}>
            Aplicação web com estruturação de sistemas e organização de componentes React.
          </p>
          <a href="https://github.com/joelysom/gameFLIX-2.0/tree/master" target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
            Ver no GitHub →
          </a>
        </div>

        <div className={styles.projectItem}>
          <h3 className={styles.projectTitle}>💳 PlayBank</h3>
          <p className={styles.projectDesc}>
            Aplicação Full Stack desenvolvida com Front-End e Back-End completos.
          </p>
          <a href="https://playbank-woad.vercel.app" target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
            Acessar →
          </a>
        </div>

        <div className={styles.projectItem}>
          <h3 className={styles.projectTitle}>🏦 Coony</h3>
          <p className={styles.projectDesc}>
            Projeto completo com Banco de Dados, Front-End e Back-End. Desenvolvido com Django e Python.
          </p>
          <a href="https://joelysom.pythonanywhere.com/" target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
            Acessar →
          </a>
        </div>

        <div className={styles.projectItem}>
          <h3 className={styles.projectTitle}>✊ Plataforma Consciência Racial</h3>
          <p className={styles.projectDesc}>
            Plataforma educacional interativa. Design, Front-End e Back-End desenvolvidos por mim.
          </p>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardH2}>Formação Acadêmica</h2>

        <div className={styles.educationItem}>
          <h3 className={styles.eduTitle}>🎓 Tecnologia da Informação (Tecnólogo)</h3>
          <p className={styles.eduInfo}>SENAC • 2023 – 2025 (Formado)</p>
        </div>

        <div className={styles.educationItem}>
          <h3 className={styles.eduTitle}>🎓 Programador de Sistemas (Técnico)</h3>
          <p className={styles.eduInfo}>SENAC • 2025 (Formado)</p>
        </div>

        <div className={styles.educationItem}>
          <h3 className={styles.eduTitle}>🎓 Análise e Desenvolvimento de Sistemas (Tecnólogo)</h3>
          <p className={styles.eduInfo}>SENAC • 2025 – 2027 (Cursando)</p>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardH2}>Atividades Complementares</h2>

        <div className={styles.activityItem}>
          <h3 className={styles.actTitle}>🤝 Voluntário em ONG de Informática</h3>
          <p className={styles.actDesc}>PROTEC / PROADTECH – SENAC</p>
          <ul className={styles.cardUl}>
            <li className={styles.cardLi}>Apoio técnico e suporte em informática básica</li>
            <li className={styles.cardLi}>Ações de inclusão digital e suporte comunitário</li>
          </ul>
        </div>

        <div className={styles.activityItem}>
          <h3 className={styles.actTitle}>👨‍🏫 Instrutor Voluntário - Manutenção de Computadores</h3>
          <p className={styles.actDesc}>Rec'n Play (Recife 2024) – SENAC</p>
          <p className={styles.cardP}>Ministrante de aula sobre manutenção de computadores com transmissão de conhecimento técnico prático.</p>
        </div>

        <div className={styles.activityItem}>
          <h3 className={styles.actTitle}>👨‍🏫 Instrutor Voluntário - Back-End</h3>
          <p className={styles.actDesc}>Rec'n Play (Recife 2025) – SENAC</p>
          <p className={styles.cardP}>Instrutor de Back-End com Python e Django, guiando integração entre Front-End, Banco de Dados e Back-End.</p>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardH2}>Idiomas</h2>

        <div className={styles.languageItem}>
          <h3 className={styles.langTitle}>🇬🇧 Inglês</h3>
          <p className={styles.langLevel}>Intermediário</p>
        </div>

        <div className={styles.languageItem}>
          <h3 className={styles.langTitle}>🇪🇸 Espanhol</h3>
          <p className={styles.langLevel}>Básico</p>
        </div>
      </section>

      <footer className={styles.footer}>
        © 2026 • Joelysom Alcantara da Silva
      </footer>

    </div>
  );
};

export default PortfolioSimple;