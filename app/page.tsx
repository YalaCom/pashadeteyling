"use client";

import { FormEvent, useEffect, useState } from "react";

const services = [
  { number: "01", title: "Детейлинг-мойка", short: "Безопасная очистка кузова, дисков, проёмов и труднодоступных зон." },
  { number: "02", title: "Химчистка салона", short: "Глубокая работа с материалами, загрязнениями и запахами." },
  { number: "03", title: "Оклейка плёнкой", short: "Защита лака, стекла и глянцевых элементов от сколов." },
  { number: "04", title: "Выпрямление вмятин", short: "Возвращение геометрии без окрашивания и потери заводского ЛКП." },
  { number: "05", title: "Полировка", short: "Удаление рисок и голограмм, глубина цвета и чистое отражение." },
  { number: "06", title: "Реставрация кожи", short: "Восстановление цвета, мягкости и аккуратного вида салона." },
  { number: "07", title: "Керамическое покрытие", short: "Гидрофобная защита, выразительный блеск и простой уход." },
  { number: "08", title: "Предпродажная подготовка", short: "Комплексная подготовка кузова и салона к продаже." },
  { number: "09", title: "Тонировка", short: "Приватность, комфорт и защита интерьера от перегрева." },
];

const projects = [
  { number: "01", src: "/works/gtr.webp", alt: "Синий Nissan GT-R после детейлинга в студии DplusD", car: "Nissan GT-R", task: "Защитный комплекс" },
  { number: "02", src: "/works/mercedes.webp", alt: "Чёрный Mercedes-Benz S-класса после полировки", car: "Mercedes-Benz S-Class", task: "Полировка кузова" },
  { number: "03", src: "/works/bmw.webp", alt: "Белый BMW M5 после финишного детейлинга", car: "BMW M5", task: "Финишный детейлинг" },
  { number: "04", src: "/works/porsche.webp", alt: "Красный Porsche 911 во время детейлинг-мойки", car: "Porsche 911", task: "Детейлинг-мойка" },
  { number: "05", src: "/works/audi.webp", alt: "Матовый Audi RS 7 после ухода за кузовом", car: "Audi RS 7", task: "Матовый кузов" },
  { number: "06", src: "/works/range-rover.webp", alt: "Чёрный Range Rover во время комплексной мойки", car: "Range Rover Sport", task: "Комплексная мойка" },
];

const comparisons = [
  { src: "/works/before-after-paint.webp", alt: "Лакокрасочное покрытие автомобиля до и после полировки", title: "Полировка кузова", text: "Изношенное покрытие снова даёт глубокое и чистое отражение." },
  { src: "/works/before-after-interior.webp", alt: "Салон Mercedes до и после химчистки", title: "Химчистка салона", text: "Следы эксплуатации уходят, фактура и цвет материалов возвращаются." },
];

const timeSlots = Array.from({ length: 25 }, (_, index) => {
  const totalMinutes = 9 * 60 + index * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
});

type SubmitState = "idle" | "sending" | "success" | "error";
type IntroPhase = "counting" | "finale" | "leaving" | "done";

function ArrowIcon({ direction = "up-right" }: { direction?: "up-right" | "down" | "up" }) {
  const path = direction === "down"
    ? "M12 4v15M6.5 13.5 12 19l5.5-5.5"
    : direction === "up"
      ? "M12 20V5M6.5 10.5 12 5l5.5 5.5"
      : "M6 18 18 6M8 6h10v10";
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d={path} /></svg>;
}

export default function Home() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [introNumber, setIntroNumber] = useState(1);
  const [introPreviousNumber, setIntroPreviousNumber] = useState<number | null>(null);
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
      root.classList.add("intro-complete");
      if (heroVideo && !reduceMotion) {
        heroVideo.currentTime = 0;
        void heroVideo.play().catch(() => undefined);
      }
    };

    if (reduceMotion) {
      timers.push(window.setTimeout(() => {
        setIntroNumber(7);
        setIntroPhase("finale");
      }, 0));
      timers.push(window.setTimeout(() => setIntroPhase("leaving"), 550));
      timers.push(window.setTimeout(finishIntro, 850));
    } else {
      [2, 3, 4, 5, 6, 7].forEach((number, index) => {
        timers.push(window.setTimeout(() => {
          setIntroPreviousNumber(number - 1);
          setIntroNumber(number);
        }, 420 * (index + 1)));
      });
      timers.push(window.setTimeout(() => setIntroPhase("finale"), 3200));
      timers.push(window.setTimeout(() => setIntroPhase("leaving"), 4400));
      timers.push(window.setTimeout(finishIntro, 4950));
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      root.classList.remove("intro-active", "intro-complete");
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const hero = document.querySelector<HTMLElement>(".hero");
    const heroVideo = document.querySelector<HTMLVideoElement>(".hero-video");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.classList.add("motion-ready");
    const updateHeader = () => root.classList.toggle("site-scrolled", window.scrollY > 32);
    let revealObserver: IntersectionObserver | undefined;
    let videoObserver: IntersectionObserver | undefined;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      if (reduceMotion) heroVideo?.pause();
    } else {
      revealObserver = new IntersectionObserver(
        (entries) => entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver?.unobserve(entry.target);
        }),
        { rootMargin: "0px 0px -9%", threshold: 0.08 },
      );
      revealItems.forEach((item) => revealObserver?.observe(item));

      if (hero && heroVideo) {
        videoObserver = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting && !root.classList.contains("intro-active")) {
            void heroVideo.play().catch(() => undefined);
          } else {
            heroVideo.pause();
          }
        }, { threshold: 0.08 });
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
          <div className="intro-meta"><span>DplusD / Detailing center</span><span>00:{String(introNumber).padStart(2, "0")}</span></div>
          <div className="intro-stage">
            {introPreviousNumber !== null && <span className="intro-figure intro-figure--previous" key={`previous-${introPreviousNumber}`}>{String(introPreviousNumber).padStart(2, "0")}</span>}
            <span className="intro-figure intro-figure--current" key={`current-${introNumber}`}>{String(introNumber).padStart(2, "0")}</span>
            <div className="intro-claim"><strong>лет</strong><span>на рынке</span></div>
          </div>
          <div className="intro-track">
            {Array.from({ length: 7 }, (_, index) => <span className={index < introNumber ? "is-active" : ""} key={index} />)}
          </div>
        </div>
      )}

      <main id="top">
        <header className="site-header">
          <div className="header-shell">
            <a className="brand" href="#top" aria-label="DplusD Detailing Center"><img src="/logo.png" alt="DplusD Detailing Center" /></a>
            <nav className="desktop-nav" aria-label="Основная навигация">
              <a href="#works">Работы</a><a href="#services">Услуги</a><a href="#contacts">Контакты</a>
            </nav>
            <a className="header-phone" href="tel:+79165042101">+7 916 504-21-01</a>
            <a className="header-action" href="#booking">Записаться <ArrowIcon /></a>
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
            <video className="hero-video" autoPlay disablePictureInPicture loop muted playsInline preload="auto" tabIndex={-1}>
              <source media="(max-width: 620px)" src="/hero-detailing-mobile.mp4" type="video/mp4" />
              <source src="/hero-detailing.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-title-wrap">
            <p>Москва / Краснобогатырская 89, стр. 4</p>
            <h1 id="hero-title"><span>А тебе нужен</span><strong>Детейлинг?</strong></h1>
          </div>
          <div className="hero-footer">
            <a className="round-action" href="#works"><span>Да!</span><ArrowIcon direction="down" /></a>
            <p><span>7 лет опыта</span><span>Кузов · Салон · Защита</span></p>
          </div>
        </section>

        <section className="manifesto-section">
          <div className="page-shell manifesto-grid">
            <div className="section-mark" data-reveal><span>001</span><span>О студии</span></div>
            <div className="manifesto-copy" data-reveal>
              <p className="manifesto-kicker">DplusD / Москва / с 2019 года</p>
              <h2>Не просто чисто.<br /><em>Безупречно.</em></h2>
              <div className="manifesto-note">
                <span>Работаем с автомобилем как с объектом дизайна.</span>
                <p>Сначала понимаем материал и задачу. Затем возвращаем каждой поверхности правильный цвет, фактуру и защиту.</p>
              </div>
            </div>
          </div>
          <div className="ticker" aria-hidden="true"><span>DETAILING / RESTORE / PROTECT / DETAILING / RESTORE / PROTECT</span></div>
        </section>

        <section className="works-section" id="works" aria-labelledby="works-title">
          <div className="page-shell works-heading" data-reveal>
            <div className="section-mark"><span>002</span><span>Избранные работы</span></div>
            <h2 id="works-title">Машины говорят<br /><em>за нас.</em></h2>
            <p>Шесть проектов. Разные задачи. Один стандарт результата.</p>
          </div>
          <div className="page-shell works-grid">
            {projects.map((project, index) => (
              <figure className={`work-card work-card-${index + 1}`} data-reveal="image" key={project.src}>
                <div className="work-media"><img src={project.src} alt={project.alt} width="1448" height="1086" loading={index < 2 ? "eager" : "lazy"} decoding="async" /></div>
                <figcaption><span>{project.number}</span><h3>{project.car}</h3><p>{project.task}</p></figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="comparison-section" aria-labelledby="comparison-title">
          <div className="page-shell comparison-heading" data-reveal>
            <div className="section-mark"><span>003</span><span>До / После</span></div>
            <h2 id="comparison-title">Результат,<br />который виден.</h2>
          </div>
          <div className="page-shell comparison-grid">
            {comparisons.map((comparison, index) => (
              <figure className="comparison-card" data-reveal="image" key={comparison.src}>
                <div className="comparison-media"><img src={comparison.src} alt={comparison.alt} width="1448" height="1086" loading="lazy" decoding="async" /><span className="before-label">До</span><span className="after-label">После</span></div>
                <figcaption><span>0{index + 1}</span><h3>{comparison.title}</h3><p>{comparison.text}</p></figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="services-section" id="services" aria-labelledby="services-title">
          <div className="page-shell services-layout">
            <div className="services-intro" data-reveal>
              <div className="section-mark"><span>004</span><span>Услуги</span></div>
              <h2 id="services-title">Всё для<br />правильного<br /><em>состояния.</em></h2>
              <p>После осмотра предложим только тот состав работ, который действительно нужен автомобилю.</p>
              <a className="text-link" href="#booking">Обсудить автомобиль <ArrowIcon /></a>
            </div>
            <div className="services-list">
              {services.map((service) => (
                <a className="service-row" data-reveal="row" href="#booking" key={service.number}>
                  <span>{service.number}</span><div><h3>{service.title}</h3><p>{service.short}</p></div><ArrowIcon />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="booking-section" id="booking" aria-labelledby="booking-title">
          <div className="page-shell booking-frame">
            <div className="booking-copy" data-reveal>
              <div className="section-mark"><span>005</span><span>Запись</span></div>
              <h2 id="booking-title">Пора вернуть<br />автомобилю<br /><em>правильный вид.</em></h2>
              <p>Оставьте контакты, выберите удобную дату и время. Мы уточним задачу и подтвердим визит.</p>
              <div className="booking-direct"><span>Можно напрямую</span><a href="tel:+79165042101">+7 916 504-21-01</a><a href="https://t.me/DplusD_Detailing_Studio" target="_blank" rel="noreferrer">Telegram студии</a></div>
            </div>

            <form className="booking-form" data-reveal onSubmit={handleSubmit}>
              <div className="form-grid">
                <label><span>Ваше имя</span><input name="name" type="text" autoComplete="name" required maxLength={80} placeholder="Имя" /></label>
                <label><span>Телефон</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={30} placeholder="+7 999 000-00-00" /></label>
                <label><span>Автомобиль</span><input name="car" type="text" required maxLength={100} placeholder="Марка и модель" /></label>
                <label><span>Услуга</span><select name="service" required defaultValue=""><option value="" disabled>Выберите услугу</option>{services.map((service) => <option value={service.title} key={service.number}>{service.title}</option>)}<option value="Консультация">Нужна консультация</option></select></label>
                <label><span>Желаемая дата</span><input name="visitDate" type="date" required /></label>
                <label><span>Желаемое время</span><select name="visitTime" required defaultValue=""><option value="" disabled>Выберите время</option>{timeSlots.map((time) => <option value={time} key={time}>{time}</option>)}</select></label>
              </div>
              <label className="form-comment"><span>Комментарий</span><textarea name="comment" rows={3} maxLength={800} placeholder="Опишите задачу или состояние автомобиля" /></label>
              <label className="honeypot" aria-hidden="true">Компания<input name="company" type="text" tabIndex={-1} autoComplete="off" /></label>
              <label className="consent"><input type="checkbox" required /><span>Я согласен с <a href="https://dplusd.moscow/privacy" target="_blank" rel="noreferrer">политикой конфиденциальности</a></span></label>
              <div className="form-submit">
                <button type="submit" disabled={submitState === "sending"}>{submitState === "sending" ? "Отправляем…" : "Отправить заявку"}<ArrowIcon /></button>
                <p className={`form-status form-status-${submitState}`} role="status" aria-live="polite">{submitMessage}</p>
              </div>
            </form>
          </div>
        </section>

        <section className="contact-section" id="contacts" aria-labelledby="contacts-title">
          <div className="page-shell contact-layout">
            <div data-reveal><div className="section-mark"><span>006</span><span>Контакты</span></div><h2 id="contacts-title">Увидимся<br /><em>в DplusD.</em></h2></div>
            <div className="contact-details" data-reveal>
              <a className="contact-phone" href="tel:+79165042101">+7 916 504-21-01</a>
              <p>Москва, ул. Краснобогатырская,<br />д. 89, стр. 4</p>
              <a href="mailto:info@dplusd.moscow">info@dplusd.moscow</a>
              <a href="https://t.me/DplusD_Detailing_Studio" target="_blank" rel="noreferrer">Telegram</a>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div className="page-shell footer-grid">
            <a className="footer-logo" href="#top" aria-label="DplusD — наверх"><img src="/logo.png" alt="DplusD Detailing Center" /></a>
            <p>© 2026 DplusD Detailing Center</p>
            <a className="to-top" href="#top">Наверх <ArrowIcon direction="up" /></a>
          </div>
        </footer>
      </main>
    </>
  );
}
