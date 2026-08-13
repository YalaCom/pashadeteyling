"use client";

import { FormEvent, useEffect, useState } from "react";

const services = [
  {
    number: "01",
    title: "Детейлинг-мойка",
    short: "Тщательная очистка кузова, салона и труднодоступных деталей.",
  },
  {
    number: "02",
    title: "Химчистка салона",
    short: "Глубокая очистка пятен и запахов без повреждения материалов.",
  },
  {
    number: "03",
    title: "Оклейка плёнкой",
    short: "Антигравийная защита ЛКП, стекла и глянцевых элементов.",
  },
  {
    number: "04",
    title: "Выпрямление вмятин",
    short: "Ремонт без окрашивания с сохранением заводского покрытия.",
  },
  {
    number: "05",
    title: "Полировка",
    short: "Возвращаем глубину цвета, гладкость и естественный блеск.",
  },
  {
    number: "06",
    title: "Реставрация кожи",
    short: "Восстановление внешнего вида кожаных деталей салона.",
  },
  {
    number: "07",
    title: "Керамическое покрытие",
    short: "Защита от УФ, воды и грязи с выразительным блеском кузова.",
  },
  {
    number: "08",
    title: "Предпродажная подготовка",
    short: "Комплекс для кузова, салона и подкапотного пространства.",
  },
  {
    number: "09",
    title: "Тонировка",
    short: "Комфорт, приватность и защита интерьера от перегрева.",
  },
];

const gallery = [
  { src: "/images/work-range.webp", alt: "Range Rover после детейлинга" },
  { src: "/images/work-dent.webp", alt: "Удаление вмятины без окрашивания" },
  { src: "/images/work-mercedes-1.webp", alt: "Mercedes после комплексного ухода" },
  { src: "/images/work-body.webp", alt: "Работа с кузовом автомобиля" },
  { src: "/images/work-interior.webp", alt: "Реставрация кожаного салона" },
  { src: "/images/work-engine.webp", alt: "Мойка подкапотного пространства" },
  { src: "/images/work-mercedes-2.webp", alt: "Полировка кузова Mercedes" },
  { src: "/images/work-finish.webp", alt: "Финишная подготовка автомобиля" },
];

const faqs = [
  {
    question: "Как лучше защитить автомобиль от внешней среды и повреждений?",
    answer:
      "Один из самых эффективных методов — оклейка полиуретановой плёнкой. Керамическое покрытие дополняет защиту: снижает влияние ультрафиолета, реагентов и низких температур.",
  },
  {
    question: "Обязательно ли окрашивать кузовную деталь после повреждения?",
    answer:
      "Не всегда. Во многих случаях проблему можно решить полировкой или ремонтом вмятин без окраса, сохранив заводское лакокрасочное покрытие.",
  },
  {
    question: "Можно ли выполнить локальный ремонт без замены детали?",
    answer:
      "Да. Локальный ремонт часто позволяет сохранить оригинальную деталь. Например, скол или трещину лобового стекла можно устранить без полной замены стекла.",
  },
  {
    question: "Почему цена отличается для двух одинаковых автомобилей?",
    answer:
      "Стоимость зависит не только от размера автомобиля, но и от характера загрязнений или повреждений, объёма материалов и времени мастера. Точная цена определяется после осмотра.",
  },
];

type SubmitState = "idle" | "sending" | "success" | "error";

export default function Home() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    const progress = document.querySelector<HTMLElement>(".scroll-progress__bar");
    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scrollFrame = 0;

    root.classList.add("motion-ready");

    const updateScroll = () => {
      scrollFrame = 0;
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollRange > 0 ? Math.min(window.scrollY / scrollRange, 1) : 0;
      root.classList.toggle("site-scrolled", window.scrollY > 24);
      progress?.style.setProperty("transform", `scaleX(${ratio})`);
    };

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScroll);
    };

    let observer: IntersectionObserver | undefined;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -10%", threshold: 0.08 },
      );
      revealItems.forEach((item) => observer?.observe(item));
    }

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
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
          name: formData.get("name"),
          phone: formData.get("phone"),
          car: formData.get("car"),
          service: formData.get("service"),
          visitDate: formData.get("visitDate"),
          visitTime: formData.get("visitTime"),
          comment: formData.get("comment"),
          company: formData.get("company"),
        }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Не удалось отправить заявку");
      }

      form.reset();
      setSubmitState("success");
      setSubmitMessage("Заявка принята. Мы свяжемся с вами для подтверждения записи.");
    } catch (error) {
      setSubmitState("error");
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : "Не удалось отправить заявку. Позвоните нам напрямую.",
      );
    }
  }

  return (
    <main id="top">
      <div className="scroll-progress" aria-hidden="true">
        <span className="scroll-progress__bar" />
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#top" aria-label="D&D Detailing Studio">
            <img src="/logo.svg" alt="D&D Detailing Studio" />
          </a>

          <nav className="desktop-nav" aria-label="Основная навигация">
            <a href="#services">Услуги</a>
            <a href="#works">Работы</a>
            <a href="#offers">Акции</a>
            <a href="#contacts">Контакты</a>
          </nav>

          <a className="header-phone" href="tel:+79165042101">
            +7 916 504-21-01
          </a>

          <details className="mobile-menu">
            <summary aria-label="Открыть меню">
              <span className="menu-label">Меню</span>
              <span className="menu-icon" aria-hidden="true">
                <i />
                <i />
              </span>
            </summary>
            <nav>
              <a href="#services" onClick={closeMobileMenu}>Услуги</a>
              <a href="#works" onClick={closeMobileMenu}>Работы</a>
              <a href="#offers" onClick={closeMobileMenu}>Акции</a>
              <a href="#contacts" onClick={closeMobileMenu}>Контакты</a>
              <a href="tel:+79165042101" onClick={closeMobileMenu}>+7 916 504-21-01</a>
            </nav>
          </details>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />
        <div className="shell hero-content">
          <p className="eyebrow">Москва · Краснобогатырская 89, стр. 4</p>
          <h1 id="hero-title">
            Детейлинг,
            <span> достойный вашего автомобиля</span>
          </h1>
          <p className="hero-copy">
            Комплексный уход за кузовом и салоном. Восстанавливаем детали,
            защищаем поверхности и возвращаем автомобилю безупречный вид.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#booking">
              Записаться
              <span aria-hidden="true">↗</span>
            </a>
            <a className="button button-ghost" href="#services">
              Смотреть услуги
            </a>
          </div>
        </div>
        <div className="hero-bottom shell">
          <p>Кузов</p>
          <p>Интерьер</p>
          <p>Защита</p>
          <p>Реставрация</p>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="shell">
          <div className="section-heading split-heading" data-reveal="up">
            <div>
              <p className="eyebrow">Полный комплекс</p>
              <h2>Услуги студии</h2>
            </div>
            <p>
              Подбираем технологию под состояние автомобиля. Не предлагаем
              лишнего — только те работы, которые дадут заметный результат.
            </p>
          </div>

          <div className="services-list">
            {services.map((service) => (
              <a className="service-row" data-reveal="row" href="#booking" key={service.number}>
                <span className="service-number">{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.short}</p>
                <span className="service-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section craft-section">
        <div className="shell craft-grid">
          <div className="craft-image craft-image-main" data-reveal="image" role="img" aria-label="Полировка кузова автомобиля" />
          <div className="craft-copy" data-reveal="up">
            <p className="eyebrow">Точность в каждой детали</p>
            <h2>Не маскируем. Восстанавливаем.</h2>
            <p>
              Полировка возвращает глубину цвета и гладкость покрытия.
              Керамика защищает лак от ультрафиолета, воды и грязи. Плёнка
              принимает на себя механические повреждения и сохраняет заводской
              вид автомобиля.
            </p>
            <a className="text-link" href="#booking">
              Получить консультацию <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="craft-image craft-image-detail" data-reveal="image" role="img" aria-label="Детейлинг интерьера автомобиля" />
        </div>
      </section>

      <section className="section works-section" id="works">
        <div className="shell">
          <div className="section-heading split-heading" data-reveal="up">
            <div>
              <p className="eyebrow">Реальные автомобили</p>
              <h2>Наши работы</h2>
            </div>
            <p>
              Фрагменты работ студии: восстановление кузова, химчистка,
              полировка, уход за интерьером и подкапотным пространством.
            </p>
          </div>

          <p className="mobile-swipe-hint" aria-hidden="true">Проведите в сторону, чтобы увидеть больше</p>

          <div className="gallery-grid">
            {gallery.map((item, index) => (
              <figure className={`gallery-item gallery-item-${index + 1}`} data-reveal="image" key={item.src}>
                <img src={item.src} alt={item.alt} loading="lazy" />
                <figcaption>
                  <span>Работа {String(index + 1).padStart(2, "0")}</span>
                  <span>D&amp;D Studio</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section offers-section" id="offers">
        <div className="shell">
          <div className="section-heading" data-reveal="up">
            <p className="eyebrow">Специальные условия</p>
            <h2>Актуальные предложения</h2>
          </div>

          <div className="offers-grid">
            <article className="offer-card offer-card-dark" data-reveal="up">
              <span className="offer-index">01</span>
              <p className="offer-value">−10%</p>
              <h3>Сезонная мойка автомобиля</h3>
              <p>
                Акцентированная очистка сезонных загрязнений на лакокрасочном
                покрытии автомобиля со скидкой.
              </p>
              <a href="#booking">Записаться</a>
            </article>
            <article className="offer-card offer-card-image" data-reveal="up">
              <span className="offer-index">02</span>
              <p className="offer-value">В подарок</p>
              <h3>Мойка ДВС и подкапотного пространства</h3>
              <p>При записи на мойку нижней части кузова.</p>
              <a href="#booking">Записаться</a>
            </article>
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="shell faq-grid">
          <div className="section-heading faq-heading" data-reveal="up">
            <p className="eyebrow">Перед записью</p>
            <h2>Частые вопросы</h2>
            <p>
              Если вашего вопроса нет в списке, позвоните или оставьте заявку —
              мастер подскажет подходящее решение.
            </p>
          </div>
          <div className="faq-list">
            {faqs.map((item, index) => (
              <details key={item.question} data-reveal="row" open={index === 0}>
                <summary>
                  <span>{item.question}</span>
                  <span className="faq-plus" aria-hidden="true">+</span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section booking-section" id="booking">
        <div className="shell booking-grid">
          <div className="booking-intro" data-reveal="up">
            <p className="eyebrow">Консультация и запись</p>
            <h2>Рассчитаем стоимость для вашего автомобиля</h2>
            <p>
              Заполните форму. Мы уточним состояние автомобиля, согласуем
              состав работ и удобное время визита.
            </p>
            <div className="booking-contact">
              <span>Можно связаться напрямую</span>
              <a href="tel:+79165042101">+7 916 504-21-01</a>
              <a href="https://t.me/DplusD_Detailing_Studio" target="_blank" rel="noreferrer">
                Telegram студии
              </a>
            </div>
          </div>

          <form className="booking-form" data-reveal="up" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                <span>Ваше имя</span>
                <input name="name" type="text" autoComplete="name" required maxLength={80} placeholder="Имя" />
              </label>
              <label>
                <span>Телефон</span>
                <input name="phone" type="tel" autoComplete="tel" required maxLength={30} placeholder="+7 999 000-00-00" />
              </label>
              <label>
                <span>Автомобиль</span>
                <input name="car" type="text" required maxLength={100} placeholder="Марка и модель" />
              </label>
              <label>
                <span>Услуга</span>
                <select name="service" required defaultValue="">
                  <option value="" disabled>Выберите услугу</option>
                  {services.map((service) => (
                    <option value={service.title} key={service.number}>{service.title}</option>
                  ))}
                  <option value="Консультация">Нужна консультация</option>
                </select>
              </label>
              <label>
                <span>Желаемая дата</span>
                <input name="visitDate" type="date" required />
              </label>
              <label>
                <span>Желаемое время</span>
                <input name="visitTime" type="time" required />
              </label>
            </div>
            <label className="form-comment">
              <span>Комментарий</span>
              <textarea name="comment" rows={4} maxLength={800} placeholder="Опишите состояние автомобиля или задачу" />
            </label>
            <label className="honeypot" aria-hidden="true">
              Компания
              <input name="company" type="text" tabIndex={-1} autoComplete="off" />
            </label>
            <label className="consent">
              <input type="checkbox" required />
              <span>
                Я согласен с <a href="https://dplusd.moscow/privacy" target="_blank" rel="noreferrer">политикой конфиденциальности</a>
              </span>
            </label>
            <div className="form-submit-row">
              <button className="button button-primary" type="submit" disabled={submitState === "sending"}>
                {submitState === "sending" ? "Отправляем…" : "Отправить заявку"}
              </button>
              <p className={`form-status form-status-${submitState}`} role="status" aria-live="polite">
                {submitMessage}
              </p>
            </div>
          </form>
        </div>
      </section>

      <section className="contact-section" id="contacts">
        <div className="shell contact-grid">
          <div data-reveal="up">
            <p className="eyebrow">D&amp;D Detailing Studio</p>
            <h2>Привезите автомобиль. Остальное — наша работа.</h2>
          </div>
          <div className="contact-list" data-reveal="up">
            <a href="tel:+79165042101">+7 916 504-21-01</a>
            <a href="mailto:info@dplusd.moscow">info@dplusd.moscow</a>
            <p>Москва, ул. Краснобогатырская, д. 89, стр. 4</p>
            <a href="https://t.me/DplusD_Detailing_Studio" target="_blank" rel="noreferrer">Telegram</a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <img src="/logo.svg" alt="D&D Detailing Studio" />
          <p>© 2026 D&amp;D Detailing Studio. Все права защищены.</p>
          <a href="#top">Наверх ↑</a>
        </div>
      </footer>

      <a className="mobile-booking-bar" href="#booking">
        <span>Записаться</span>
        <span aria-hidden="true">↗</span>
      </a>
    </main>
  );
}
