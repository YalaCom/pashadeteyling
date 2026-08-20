"use client";

import { FormEvent, useEffect, useState } from "react";

const services = [
  { number: "01", title: "Детейлинг-мойка", short: "Безопасно очищаем кузов, диски, проёмы и труднодоступные зоны." },
  { number: "02", title: "Химчистка салона", short: "Удаляем глубокие загрязнения и запахи, сохраняя фактуру материалов." },
  { number: "03", title: "Оклейка плёнкой", short: "Защищаем лак, стекло и глянцевые элементы от сколов и царапин." },
  { number: "04", title: "Выпрямление вмятин", short: "Возвращаем геометрию детали без окрашивания и потери заводского ЛКП." },
  { number: "05", title: "Полировка", short: "Убираем риски и голограммы, возвращаем цвету глубину и чистое отражение." },
  { number: "06", title: "Реставрация кожи", short: "Восстанавливаем цвет, мягкость и аккуратный вид кожаных элементов." },
  { number: "07", title: "Керамическое покрытие", short: "Создаём гидрофобную защиту с выразительным блеском и лёгким уходом." },
  { number: "08", title: "Предпродажная подготовка", short: "Комплексно приводим кузов и салон в состояние, которое продаёт автомобиль." },
  { number: "09", title: "Тонировка", short: "Добавляем приватность, комфорт и защиту интерьера от перегрева." },
];

const projects = [
  { number: "01", src: "/works/gtr.webp", alt: "Синий Nissan GT-R после детейлинга в студии DplusD", car: "Nissan GT-R", task: "Защитный комплекс" },
  { number: "02", src: "/works/mercedes.webp", alt: "Чёрный Mercedes-Benz S-класса после полировки", car: "Mercedes-Benz S-Class", task: "Полировка кузова" },
  { number: "03", src: "/works/bmw.webp", alt: "Белый BMW M5 после финишного детейлинга", car: "BMW M5", task: "Финишный детейлинг" },
  { number: "04", src: "/works/porsche.webp", alt: "Красный Porsche 911 во время детейлинг-мойки", car: "Porsche 911", task: "Детейлинг-мойка" },
  { number: "05", src: "/works/audi.webp", alt: "Матовый Audi RS 7 после ухода за кузовом", car: "Audi RS 7", task: "Уход за матовым кузовом" },
  { number: "06", src: "/works/range-rover.webp", alt: "Чёрный Range Rover во время комплексной мойки", car: "Range Rover Sport", task: "Комплексная мойка" },
];

const comparisons = [
  { number: "01", src: "/works/before-after-paint.webp", alt: "Лакокрасочное покрытие автомобиля до и после полировки", title: "Кузов", text: "Глубокие риски и паутина ушли. Осталось чистое отражение." },
  { number: "02", src: "/works/before-after-interior.webp", alt: "Салон Mercedes до и после химчистки", title: "Салон", text: "Следы эксплуатации убраны, фактура и цвет материалов восстановлены." },
];

const timeSlots = Array.from({ length: 25 }, (_, index) => {
  const totalMinutes = 9 * 60 + index * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
});

type SubmitState = "idle" | "sending" | "success" | "error";
type IntroPhase = "counting" | "reveal" | "exit" | "done";

function ArrowDownIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M12 4v15M6.5 13.5 12 19l5.5-5.5" /></svg>;
}

function ArrowUpRightIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M6 18 18 6M8 6h10v10" /></svg>;
}

function ArrowUpIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M12 20V5M6.5 10.5 12 5l5.5 5.5" /></svg>;
}

export default function Home() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [introNumber, setIntroNumber] = useState(1);
  const [introPhase, setIntroPhase] = useState<IntroPhase>("counting");

  useEffect(() => {
    const root = document.documentElement;
    const heroVideo = document.querySelector<HTMLVideoElement>(".hero-video");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];

    root.classList.add("intro-active");
    heroVideo?.pause();

    const finishIntro = () => {
      setIntroPhase("done");
      root.classList.remove("intro-active");

      if (heroVideo && !reduceMotion) {
        heroVideo.currentTime = 0;
        void heroVideo.play().catch(() => undefined);
      }
    };

    if (reduceMotion) {
      timers.push(window.setTimeout(() => {
        setIntroNumber(7);
        setIntroPhase("reveal");
      }, 0));
      timers.push(window.setTimeout(() => setIntroPhase("exit"), 650));
      timers.push(window.setTimeout(finishIntro, 1050));
    } else {
      [2, 3, 4, 5, 6, 7].forEach((number, index) => {
        timers.push(window.setTimeout(() => setIntroNumber(number), 520 * (index + 1)));
      });
      timers.push(window.setTimeout(() => setIntroPhase("reveal"), 3660));
      timers.push(window.setTimeout(() => setIntroPhase("exit"), 5000));
      timers.push(window.setTimeout(finishIntro, 5800));
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      root.classList.remove("intro-active");
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const hero = document.querySelector<HTMLElement>(".hero");
    const heroVideo = document.querySelector<HTMLVideoElement>(".hero-video");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.classList.add("motion-ready");
    const updateHeader = () => root.classList.toggle("site-scrolled", window.scrollY > 24);

    let revealObserver: IntersectionObserver | undefined;
    let videoObserver: IntersectionObserver | undefined;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      if (reduceMotion) heroVideo?.pause();
    } else {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver?.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8%", threshold: 0.08 },
      );
      revealItems.forEach((item) => revealObserver?.observe(item));

      if (hero && heroVideo) {
        videoObserver = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && !root.classList.contains("intro-active")) {
              void heroVideo.play().catch(() => undefined);
            }
            else heroVideo.pause();
          },
          { threshold: 0.08 },
        );
        videoObserver.observe(hero);
      }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => {
      revealObserver?.disconnect();
      videoObserver?.disconnect();
      window.removeEventListener("scroll", updateHeader);
      root.classList.remove("motion-ready", "site-scrolled");
    };
  }, []);

  function closeMobileMenu() {
    document.querySelector<HTMLDetailsElement>(".mobile-menu")?.removeAttribute("open");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitState("sending");
    setSubmitMessage("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"), phone: formData.get("phone"), car: formData.get("car"),
          service: formData.get("service"), visitDate: formData.get("visitDate"),
          visitTime: formData.get("visitTime"), comment: formData.get("comment"), company: formData.get("company"),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Не удалось отправить заявку");
      form.reset();
      setSubmitState("success");
      setSubmitMessage("Заявка принята. Мы свяжемся с вами и подтвердим запись.");
    } catch (error) {
      setSubmitState("error");
      setSubmitMessage(error instanceof Error ? error.message : "Не удалось отправить заявку. Позвоните нам напрямую.");
    }
  }

  return (
    <>
      {introPhase !== "done" && (
        <div className={`intro-screen intro-screen--${introPhase}`} aria-hidden="true">
          <div className="intro-lockup">
            <span className="intro-number" key={introNumber}>{introNumber}</span>
            <span className="intro-label">лет на рынке</span>
          </div>
        </div>
      )}

      <main id="top">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="DplusD Detailing Center"><img src="/logo.png" alt="DplusD Detailing Center" /></a>
          <p className="header-address">Москва · Краснобогатырская, 89 стр. 4</p>
          <nav className="desktop-nav" aria-label="Основная навигация">
            <a href="#works">Работы</a><a href="#services">Услуги</a><a href="#contacts">Контакты</a>
          </nav>
          <a className="header-action" href="#booking">Записаться <ArrowUpRightIcon /></a>
          <details className="mobile-menu">
            <summary aria-label="Открыть меню"><span /><span /></summary>
            <nav aria-label="Мобильная навигация">
              <a href="#works" onClick={closeMobileMenu}>Работы</a>
              <a href="#services" onClick={closeMobileMenu}>Услуги</a>
              <a href="#booking" onClick={closeMobileMenu}>Записаться</a>
              <a href="#contacts" onClick={closeMobileMenu}>Контакты</a>
              <a href="tel:+79165042101" onClick={closeMobileMenu}>+7 916 504-21-01</a>
            </nav>
          </details>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-media" aria-hidden="true">
          <video className="hero-video" autoPlay disablePictureInPicture loop muted playsInline poster="/images/hero.webp" preload="auto" tabIndex={-1}>
            <source media="(max-width: 620px)" src="/hero-detailing-mobile.mp4" type="video/mp4" />
            <source src="/hero-detailing.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-copy">
          <p className="hero-kicker">DplusD · Detailing Center · Moscow</p>
          <h1 id="hero-title"><span>А тебе нужен</span><strong>Детейлинг?</strong></h1>
        </div>
        <a className="hero-cta" href="#works"><span>Хочу!</span><ArrowDownIcon /></a>
        <p className="hero-note">Кузов · Салон · Защита · Реставрация</p>
      </section>

      <section className="works-section" id="works" aria-labelledby="works-title">
        <div className="page-shell works-intro" data-reveal>
          <div className="section-index"><span>01 / 04</span><span>Избранные работы</span></div>
          <h2 id="works-title">Сделано<span>в DplusD.</span></h2>
          <div className="works-lead">
            <p>Не прячем результат за рамками и фильтрами. Машина, свет и работа, которую видно с первого взгляда.</p>
            <span className="signal-dot" aria-hidden="true" />
          </div>
        </div>

        <div className="project-feed">
          {projects.map((project, index) => (
            <figure className={`project project-${index + 1}`} data-reveal="image" key={project.src}>
              <figcaption>
                <span className="project-number">/{project.number}</span>
                <h3>{project.car}</h3>
                <span className="project-task">{project.task}</span>
              </figcaption>
              <div className="project-media">
                <img src={project.src} alt={project.alt} width="1448" height="1086" loading={index === 0 ? "eager" : "lazy"} decoding="async" />
              </div>
            </figure>
          ))}
        </div>

        <div className="page-shell works-outro" data-reveal>
          <p>Следующая машина может быть вашей.</p>
          <a className="pill-action" href="#booking">Записаться <ArrowUpRightIcon /></a>
        </div>
      </section>

      <section className="comparison-section" aria-labelledby="comparison-title">
        <div className="page-shell">
          <div className="section-index" data-reveal><span>02 / 04</span><span>До и после</span></div>
          <div className="comparison-heading" data-reveal>
            <h2 id="comparison-title">Разница без объяснений.</h2>
            <p>Передвиньте взгляд слева направо. Этого достаточно.</p>
          </div>
          <div className="comparison-grid">
            {comparisons.map((comparison) => (
              <figure className="comparison-card" data-reveal="image" key={comparison.src}>
                <img src={comparison.src} alt={comparison.alt} width="1448" height="1086" loading="lazy" decoding="async" />
                <figcaption><span>/{comparison.number}</span><h3>{comparison.title}</h3><p>{comparison.text}</p></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="services-section" id="services" aria-labelledby="services-title">
        <div className="page-shell">
          <div className="section-index" data-reveal><span>03 / 04</span><span>Что мы делаем</span></div>
          <div className="services-heading" data-reveal>
            <h2 id="services-title">Всё, что нужно автомобилю. Ничего лишнего.</h2>
            <p>Сначала осматриваем машину. Потом предлагаем только тот состав работ, который действительно даст результат.</p>
          </div>
          <div className="services-list">
            {services.map((service) => (
              <a className="service-row" data-reveal="row" href="#booking" key={service.number}>
                <span className="service-number">{service.number}</span><h3>{service.title}</h3><p>{service.short}</p>
                <span className="service-arrow" aria-hidden="true"><ArrowUpRightIcon /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="booking-section" id="booking" aria-labelledby="booking-title">
        <div className="page-shell">
          <div className="section-index" data-reveal><span>04 / 04</span><span>Запись</span></div>
          <div className="booking-layout">
            <div className="booking-copy" data-reveal>
              <h2 id="booking-title">Покажите нам автомобиль.</h2>
              <p>Укажите удобную дату и время. Мы уточним задачу, рассчитаем стоимость и подтвердим визит.</p>
              <div className="direct-contact">
                <span>Или свяжитесь напрямую</span>
                <a href="tel:+79165042101">+7 916 504-21-01</a>
                <a href="https://t.me/DplusD_Detailing_Studio" target="_blank" rel="noreferrer">Telegram студии</a>
              </div>
            </div>

            <form className="booking-form" data-reveal onSubmit={handleSubmit}>
              <div className="form-grid">
                <label><span>Ваше имя</span><input name="name" type="text" autoComplete="name" required maxLength={80} placeholder="Имя" /></label>
                <label><span>Телефон</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={30} placeholder="+7 999 000-00-00" /></label>
                <label><span>Автомобиль</span><input name="car" type="text" required maxLength={100} placeholder="Марка и модель" /></label>
                <label>
                  <span>Услуга</span>
                  <select name="service" required defaultValue="">
                    <option value="" disabled>Выберите услугу</option>
                    {services.map((service) => <option value={service.title} key={service.number}>{service.title}</option>)}
                    <option value="Консультация">Нужна консультация</option>
                  </select>
                </label>
                <label><span>Желаемая дата</span><input name="visitDate" type="date" required /></label>
                <label>
                  <span>Желаемое время</span>
                  <select name="visitTime" required defaultValue="">
                    <option value="" disabled>Выберите время</option>
                    {timeSlots.map((time) => <option value={time} key={time}>{time}</option>)}
                  </select>
                </label>
              </div>
              <label className="form-comment"><span>Комментарий</span><textarea name="comment" rows={3} maxLength={800} placeholder="Опишите задачу или состояние автомобиля" /></label>
              <label className="honeypot" aria-hidden="true">Компания<input name="company" type="text" tabIndex={-1} autoComplete="off" /></label>
              <label className="consent">
                <input type="checkbox" required />
                <span>Я согласен с <a href="https://dplusd.moscow/privacy" target="_blank" rel="noreferrer">политикой конфиденциальности</a></span>
              </label>
              <div className="form-submit">
                <button className="pill-action" type="submit" disabled={submitState === "sending"}>
                  {submitState === "sending" ? "Отправляем…" : "Отправить заявку"}<ArrowUpRightIcon />
                </button>
                <p className={`form-status form-status-${submitState}`} role="status" aria-live="polite">{submitMessage}</p>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contacts" aria-labelledby="contacts-title">
        <div className="page-shell contact-layout">
          <div data-reveal><p className="contact-kicker">DplusD Detailing Center · Москва</p><h2 id="contacts-title">Давайте вернём машине правильный вид.</h2></div>
          <div className="contact-details" data-reveal>
            <a className="contact-phone" href="tel:+79165042101">+7 916 504-21-01</a>
            <p>Москва, ул. Краснобогатырская, д. 89, стр. 4</p>
            <a href="mailto:info@dplusd.moscow">info@dplusd.moscow</a>
            <a href="https://t.me/DplusD_Detailing_Studio" target="_blank" rel="noreferrer">Telegram</a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="page-shell footer-inner">
          <a className="footer-logo" href="#top" aria-label="DplusD — наверх"><img src="/logo.png" alt="DplusD Detailing Center" /></a>
          <p>© 2026 DplusD Detailing Center</p>
          <a className="to-top" href="#top">Наверх <ArrowUpIcon /></a>
        </div>
      </footer>
      </main>
    </>
  );
}
