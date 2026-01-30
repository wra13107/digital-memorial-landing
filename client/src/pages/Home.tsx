import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Play, Heart, MapPin, Music, Users, CheckCircle2, Lock, AlertCircle } from "lucide-react";
import { useState } from "react";
import DemoProfileModal from "@/components/DemoProfileModal";
import BeforeAfterComparison from "@/components/BeforeAfterComparison";

/**
 * Digital Memorials Landing Page
 * Design: "Light Eternity" - Premium Minimalism
 * 
 * Color Palette:
 * - Background (Ivory): #FDFBF7
 * - Secondary (Air): #F0F4F8
 * - Accent (Gold): #C49F64
 * - Text (Graphite): #2C353D
 * - Text (Gray): #6E7A85
 * 
 * Typography:
 * - Headings: Spectral (serif) - Tradition, History
 * - Body: Manrope (sans-serif) - Technology, Readability
 * 
 * Animations: AOS (Animate On Scroll) with fade-up effect
 */

export default function Home() {
  const [checkEmail, setCheckEmail] = useState("");
  const [checkName, setCheckName] = useState("");
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* ============ HEADER ============ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Demoria Logo" className="h-12 w-auto" />
          </div>
        </div>
      </header>

      {/* ============ BLOCK 1: HERO SCREEN ============ */}
      <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#F0F4F8] to-[#FDFBF7]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-memorial-qr.jpg"
            alt="Memorial with QR code at sunset"
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7] via-transparent to-[#FDFBF7]" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6" data-aos="fade-up" data-aos-duration="800">
            <h1 className="text-5xl md:text-6xl font-bold text-[#2C353D] leading-tight">
              Камень хранит имя.
              <br />
              <span className="text-[#C49F64]">Мы храним жизнь.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#2C353D] max-w-xl mx-auto leading-relaxed font-medium">
              Создайте цифровую страницу памяти с фото, видео и голосом близкого человека. Доступна в один клик прямо на месте захоронения через QR-код.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
              <Button
                size="lg"
                className="bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Создать страницу памяти
              </Button>
              <Button
                size="lg"
                className="bg-[#C49F64]/50 hover:bg-[#C49F64] text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={() => setDemoModalOpen(true)}
              >
                <Play className="w-4 h-4 mr-2" />
                Посмотреть пример
              </Button>
            </div>

            <p className="text-sm text-[#6E7A85] pt-4" data-aos="fade-up" data-aos-delay="400" data-aos-duration="800">
              Бесплатно. Без привязки карты.
            </p>
          </div>
        </div>
      </section>

      {/* ============ BLOCK 2: BEFORE/AFTER CONTRAST ============ */}
      <section className="py-20 px-4 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#2C353D] mb-16" data-aos="fade-up" data-aos-duration="800">
            От памятника к памяти
          </h2>

          <div className="space-y-8" data-aos="fade-up" data-aos-duration="800">
            <div className="max-w-4xl mx-auto">
              <BeforeAfterComparison
                beforeImage="/images/before-after-memorial.jpg"
                afterImage="/images/before-after-memorial.jpg"
                beforeLabel="Традиционный памятник"
                afterLabel="Цифровой мемориал"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
              <div className="space-y-3" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
                <h3 className="text-xl font-bold text-[#2C353D]">Традиционный подход</h3>
                <p className="text-lg text-[#6E7A85] leading-relaxed">
                  Со временем надписи стираются, а истории забываются. Дети не узнают, каким был голос их прадеда. Память живёт только в сердцах.
                </p>
              </div>

              <div className="space-y-3" data-aos="fade-up" data-aos-delay="400" data-aos-duration="800">
                <h3 className="text-xl font-bold text-[#C49F64]">Цифровой мемориал</h3>
                <p className="text-lg text-[#2C353D] font-semibold leading-relaxed">
                  Живая история, доступная через поколения. Голос, смех и мудрость навсегда с вами. Память становится наследством.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BLOCK 3: THREE SIMPLE STEPS ============ */}
      <section className="py-20 px-4 bg-[#F0F4F8]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#2C353D] mb-4" data-aos="fade-up" data-aos-duration="800">
            Три простых шага
          </h2>
          <p className="text-center text-[#6E7A85] text-lg mb-16 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100" data-aos-duration="800">
            Создание цифровой страницы памяти займет всего несколько минут
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center space-y-4" data-aos="fade-up" data-aos-duration="800">
              <div className="mx-auto w-48 h-48 rounded-lg overflow-hidden shadow-md mb-6">
                <img
                  src="/images/three-steps-illustration.jpg"
                  alt="Step 1: Fill profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#2C353D]">Заполните профиль</h3>
              <p className="text-[#6E7A85]">
                Загрузите любимые фото и напишите биографию в простом редакторе.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
              <div className="mx-auto w-48 h-48 rounded-lg overflow-hidden shadow-md mb-6">
                <img
                  src="/images/three-steps-illustration.jpg"
                  alt="Step 2: Get nameplate"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#2C353D]">Получите табличку</h3>
              <p className="text-[#6E7A85]">
                Мы изготовим вечную табличку из металла или фарфора и доставим её вам.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4" data-aos="fade-up" data-aos-delay="400" data-aos-duration="800">
              <div className="mx-auto w-48 h-48 rounded-lg overflow-hidden shadow-md mb-6">
                <img
                  src="/images/three-steps-illustration.jpg"
                  alt="Step 3: Install"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#2C353D]">Установите за 2 минуты</h3>
              <p className="text-[#6E7A85]">
                Надежное крепление на любой памятник без сверления.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="600" data-aos-duration="800">
            <Button
              size="lg"
              className="bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold shadow-lg"
            >
              Начать заполнение профиля
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ============ BLOCK 4: DIGITAL CAPSULE FEATURES ============ */}
      <section className="py-20 px-4 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#2C353D] mb-16" data-aos="fade-up" data-aos-duration="800">
            Цифровая капсула памяти
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Smartphone Image */}
            <div className="flex justify-center" data-aos="fade-up" data-aos-duration="800">
              <div className="relative">
                <img
                  src="/images/smartphone-memorial-interface.jpg"
                  alt="Memorial interface on smartphone"
                  className="w-full max-w-sm shadow-2xl rounded-3xl"
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-8" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
              {/* Feature 1: Voice */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C49F64]/20 flex items-center justify-center">
                  <Music className="w-6 h-6 text-[#C49F64]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2C353D] mb-2">Голос</h4>
                  <p className="text-[#6E7A85]">
                    Загрузите аудиосообщения или видео. Услышьте родной голос снова.
                  </p>
                </div>
              </div>

              {/* Feature 2: Location */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C49F64]/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#C49F64]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2C353D] mb-2">Геолокация</h4>
                  <p className="text-[#6E7A85]">
                    Точные координаты захоронения для дальних родственников.
                  </p>
                </div>
              </div>

              {/* Feature 3: Candle */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C49F64]/20 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-[#C49F64]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2C353D] mb-2">Книга памяти</h4>
                  <p className="text-[#6E7A85]">
                    Друзья могут зажечь виртуальную свечу и написать слова поддержки.
                  </p>
                </div>
              </div>

              {/* Feature 4: Family Tree */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C49F64]/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#C49F64]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2C353D] mb-2">Семейное древо</h4>
                  <p className="text-[#6E7A85]">
                    Связи между профилями членов семьи.
                  </p>
                </div>
              </div>

              {/* Audio Link */}
              <div className="pt-4" data-aos="fade-up" data-aos-delay="400" data-aos-duration="800">
                <button className="text-[#C49F64] font-semibold hover:underline flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Послушать пример аудиозаписи
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BLOCK 5: NAMEPLATE MACRO ============ */}
      <section className="py-20 px-4 bg-[#F0F4F8]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="flex justify-center order-2 lg:order-1" data-aos="fade-up" data-aos-duration="800">
              <img
                src="/images/nameplate-macro.jpg"
                alt="Premium nameplate macro photography"
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>

            {/* Content */}
            <div className="space-y-6 order-1 lg:order-2" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
              <h2 className="text-4xl md:text-5xl font-bold text-[#2C353D]">
                Ювелирное изделие, а не просто код
              </h2>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#C49F64] flex-shrink-0 mt-1" />
                  <p className="text-[#6E7A85]">
                    <span className="font-semibold text-[#2C353D]">Нержавеющая сталь / Керамогранит / Закаленное стекло</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#C49F64] flex-shrink-0 mt-1" />
                  <p className="text-[#6E7A85]">
                    <span className="font-semibold text-[#2C353D]">Не выцветает на солнце</span> — Гарантия 50 лет
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#C49F64] flex-shrink-0 mt-1" />
                  <p className="text-[#6E7A85]">
                    <span className="font-semibold text-[#2C353D]">Сверхсильное крепление</span> — 3M VHB скотч индустриального класса
                  </p>
                </div>
              </div>

              {/* Name Check Form */}
              <div className="bg-white rounded-lg p-6 shadow-md border border-[#F0F4F8]" data-aos="fade-up" data-aos-delay="400" data-aos-duration="800">
                <p className="text-sm font-semibold text-[#6E7A85] mb-3">
                  Проверьте, свободно ли красивое имя ссылки
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center bg-[#FDFBF7] rounded px-3 border border-[#E8E8E8]">
                    <span className="text-[#6E7A85] text-sm">memory.com/</span>
                    <Input
                      type="text"
                      placeholder="Введите имя"
                      value={checkName}
                      onChange={(e) => setCheckName(e.target.value)}
                      className="border-0 bg-transparent focus:outline-none text-[#2C353D]"
                    />
                  </div>
                  <Button className="bg-[#C49F64] hover:bg-[#b8934f] text-white">
                    Проверить
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BLOCK 6: SOCIAL PROOF & STATISTICS ============ */}
      <section className="py-20 px-4 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#2C353D] mb-16" data-aos="fade-up" data-aos-duration="800">
            Нам доверяют семьи по всему миру
          </h2>

          {/* Testimonial */}
          <div className="max-w-3xl mx-auto mb-16 text-center" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
            <blockquote className="text-2xl md:text-3xl text-[#2C353D] font-light italic mb-6 leading-relaxed">
              "Я живу в другой стране, но теперь я могу "прийти" к папе, посмотреть его фото и показать его внукам. Это дает мне чувство покоя."
            </blockquote>
            <p className="text-[#6E7A85] font-semibold">— Мария К., Канада</p>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-center p-8 bg-[#F0F4F8] rounded-lg" data-aos="fade-up" data-aos-delay="400" data-aos-duration="800">
              <p className="text-5xl md:text-6xl font-bold text-[#C49F64] mb-2">
                15,000+
              </p>
              <p className="text-lg text-[#6E7A85]">мемориалов создано</p>
            </div>
            <div className="text-center p-8 bg-[#F0F4F8] rounded-lg" data-aos="fade-up" data-aos-delay="600" data-aos-duration="800">
              <p className="text-5xl md:text-6xl font-bold text-[#C49F64] mb-2">
                14
              </p>
              <p className="text-lg text-[#6E7A85]">стран присутствия</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BLOCK 7: PRICING ============ */}
      <section className="py-20 px-4 bg-[#F0F4F8]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#2C353D] mb-16" data-aos="fade-up" data-aos-duration="800">
            Выберите подходящий тариф
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan 1: Subscription */}
            <div className="bg-white rounded-lg p-8 shadow-md border border-[#E8E8E8]" data-aos="fade-up" data-aos-duration="800">
              <h3 className="text-2xl font-bold text-[#2C353D] mb-4">Подписка</h3>
              <p className="text-[#6E7A85] mb-6">Для тех, кто хочет попробовать</p>
              
              <div className="mb-6">
                <p className="text-3xl font-bold text-[#2C353D] mb-2">
                  999 ₽<span className="text-lg text-[#6E7A85]">/год</span>
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex gap-2 text-[#6E7A85]">
                  <CheckCircle2 className="w-5 h-5 text-[#C49F64] flex-shrink-0" />
                  Цифровая страница памяти
                </li>
                <li className="flex gap-2 text-[#6E7A85]">
                  <CheckCircle2 className="w-5 h-5 text-[#C49F64] flex-shrink-0" />
                  Фото и видео
                </li>
                <li className="flex gap-2 text-[#6E7A85]">
                  <CheckCircle2 className="w-5 h-5 text-[#C49F64] flex-shrink-0" />
                  Базовая поддержка
                </li>
              </ul>

              <Button variant="outline" className="w-full border-[#C49F64] text-[#C49F64]">
                Выбрать
              </Button>
            </div>

            {/* Plan 2: Legacy (Featured) */}
            <div className="bg-gradient-to-br from-[#C49F64]/10 to-[#C49F64]/5 rounded-lg p-8 shadow-lg border-2 border-[#C49F64] relative" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
              <div className="absolute -top-4 left-6 bg-[#C49F64] text-white px-4 py-1 rounded-full text-sm font-semibold">
                Выбор 95% семей
              </div>

              <h3 className="text-2xl font-bold text-[#2C353D] mb-4 mt-4">Наследие</h3>
              <p className="text-[#6E7A85] mb-6">Вечное хранение памяти</p>
              
              <div className="mb-6">
                <p className="text-3xl font-bold text-[#2C353D] mb-2">
                  4,999 ₽<span className="text-lg text-[#6E7A85]"> один раз</span>
                </p>
                <p className="text-sm text-[#6E7A85]">Дешевле, чем венок из живых цветов</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex gap-2 text-[#2C353D] font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-[#C49F64] flex-shrink-0" />
                  Вечное хранение
                </li>
                <li className="flex gap-2 text-[#2C353D] font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-[#C49F64] flex-shrink-0" />
                  Табличка с доставкой
                </li>
                <li className="flex gap-2 text-[#2C353D] font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-[#C49F64] flex-shrink-0" />
                  Премиум-дизайн страницы
                </li>
                <li className="flex gap-2 text-[#2C353D] font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-[#C49F64] flex-shrink-0" />
                  Приоритетная поддержка
                </li>
              </ul>

              <Button className="w-full bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold">
                Оформить Вечный тариф
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BLOCK 8: FAQ & GUARANTEES ============ */}
      <section className="py-20 px-4 bg-[#FDFBF7]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#2C353D] mb-16" data-aos="fade-up" data-aos-duration="800">
            Гарантии и безопасность
          </h2>

          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-[#E8E8E8]" data-aos="fade-up" data-aos-duration="800">
              <div className="flex gap-4">
                <Lock className="w-6 h-6 text-[#C49F64] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#2C353D] mb-2">
                    Где хранятся данные?
                  </h3>
                  <p className="text-[#6E7A85]">
                    Все данные хранятся на распределенных серверах с автоматическим резервным копированием. Ваша память защищена 24/7.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-[#E8E8E8]" data-aos="fade-up" data-aos-delay="100" data-aos-duration="800">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-[#C49F64] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#2C353D] mb-2">
                    Кто видит страницу?
                  </h3>
                  <p className="text-[#6E7A85]">
                    Вы полностью контролируете доступ. Страница доступна только по ссылке или с паролем — только тем, кого вы пригласили.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-[#E8E8E8]" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#C49F64] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#2C353D] mb-2">
                    Что если табличка повредится?
                  </h3>
                  <p className="text-[#6E7A85]">
                    Бесплатная замена. Мы гарантируем качество на 50 лет. Если что-то случится, мы изготовим новую табличку бесплатно.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BLOCK 9: FOOTER ============ */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-[#FDFBF7] to-[#F0F4F8] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src="/images/footer-logo-bg.png"
            alt="Footer background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/80 via-[#F0F4F8]/70 to-[#FDFBF7]/80" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
          {/* Main Message */}
          <div className="space-y-4" data-aos="fade-up" data-aos-duration="800">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2C353D]">
              Память — это единственное, что нельзя отнять.
            </h2>
            <p className="text-xl text-[#6E7A85]">
              Начните сохранять её сегодня.
            </p>
          </div>

          {/* Email Signup */}
          <div className="max-w-md mx-auto space-y-4" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Ваш email или телефон"
                value={checkEmail}
                onChange={(e) => setCheckEmail(e.target.value)}
                className="bg-white border-[#E8E8E8]"
              />
              <Button className="bg-[#C49F64] hover:bg-[#b8934f] text-white whitespace-nowrap">
                Сохранить
              </Button>
            </div>
            <p className="text-sm text-[#6E7A85]">
              Сохраните черновик страницы памяти
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4" data-aos="fade-up" data-aos-delay="400" data-aos-duration="800">
            <p className="text-lg font-semibold text-[#2C353D]">
              Мы на связи и поможем с любым вопросом
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href="tel:+79991234567" className="text-[#C49F64] font-bold text-lg hover:underline">
                +7 (999) 123-45-67
              </a>
              <a href="https://wa.me/79991234567" className="text-[#C49F64] font-bold text-lg hover:underline">
                WhatsApp
              </a>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t border-[#E8E8E8]">
            <p className="text-sm text-[#6E7A85]">
              © 2026 Цифровой мемориал. Все права защищены.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Profile Modal */}
      <DemoProfileModal open={demoModalOpen} onOpenChange={setDemoModalOpen} />
    </div>
  );
}
