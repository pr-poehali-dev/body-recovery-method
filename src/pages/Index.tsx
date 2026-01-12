import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const APPOINTMENTS_API = 'https://functions.poehali.dev/db2ade7f-6bfc-47d7-b2e0-fe51bd2fd0b9';
const CONTACT_API = 'https://functions.poehali.dev/6cfa1325-568d-43e5-8af3-46c6fe12c307';

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBooking = async () => {
    if (!date || !selectedTime || !bookingEmail || !bookingName) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(APPOINTMENTS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: bookingEmail,
          name: bookingName,
          phone: bookingPhone,
          date: date.toISOString().split('T')[0],
          time: selectedTime,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Запись успешна!',
          description: `Ваша консультация назначена на ${date.toLocaleDateString('ru-RU')} в ${selectedTime}`,
        });
        setBookingEmail('');
        setBookingName('');
        setBookingPhone('');
        setSelectedTime('');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать запись. Попробуйте позже.',
        variant: 'destructive',
      });
    }
  };

  const handleContactSubmit = async () => {
    if (!contactName || !contactEmail || !contactMessage) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(CONTACT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          message: contactMessage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Сообщение отправлено!',
          description: 'Мы свяжемся с вами в ближайшее время',
        });
        setContactName('');
        setContactEmail('');
        setContactPhone('');
        setContactMessage('');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить сообщение. Попробуйте позже.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-secondary/20 to-white">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Методика исцеления</h1>
            <div className="hidden md:flex gap-8 items-center">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <Icon name="User" className="mr-2" size={18} />
                Личный кабинет
              </Button>
              {['home', 'method', 'process', 'results', 'testimonials', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="text-foreground hover:text-primary transition-colors duration-300"
                >
                  {section === 'home' && 'Главная'}
                  {section === 'method' && 'Методика'}
                  {section === 'process' && 'Процесс'}
                  {section === 'results' && 'Результаты'}
                  {section === 'testimonials' && 'Отзывы'}
                  {section === 'contact' && 'Контакты'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Путь к восстановлению через{' '}
                <span className="text-primary">самоисцеление</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Авторская методика, которая помогает активировать внутренние ресурсы организма
                для естественного восстановления и оздоровления
              </p>
              <Button
                size="lg"
                onClick={() => scrollToSection('contact')}
                className="text-lg px-8 py-6 rounded-full"
              >
                Записаться на консультацию
              </Button>
            </div>
            <div className="animate-fade-in">
              <img
                src="https://cdn.poehali.dev/projects/d0bc2123-3872-4c4a-a615-6b9d6d2f2e53/files/873932fa-0263-48ef-b8fb-64c5d78324a6.jpg"
                alt="Пространство для исцеления"
                className="rounded-3xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="method" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Авторская методика</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Целостный подход к восстановлению организма на всех уровнях
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'Brain',
                title: 'Ментальный уровень',
                description: 'Работа с установками, убеждениями и паттернами мышления',
              },
              {
                icon: 'Heart',
                title: 'Эмоциональный баланс',
                description: 'Освобождение от эмоциональных блоков и травм',
              },
              {
                icon: 'Sparkles',
                title: 'Физическое тело',
                description: 'Активация естественных механизмов самовосстановления',
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Icon name={item.icon} className="text-primary" size={32} />
                  </div>
                  <CardTitle className="text-2xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Как проходит процесс</h2>
          <div className="space-y-8">
            {[
              {
                step: 1,
                title: 'Диагностика состояния',
                description: 'Глубокий анализ текущего состояния на всех уровнях',
                duration: '1-2 сеанса',
              },
              {
                step: 2,
                title: 'Индивидуальная программа',
                description: 'Создание персонального плана восстановления',
                duration: '1 неделя',
              },
              {
                step: 3,
                title: 'Активная работа',
                description: 'Регулярные сеансы и самостоятельная практика',
                duration: '1-3 месяца',
              },
              {
                step: 4,
                title: 'Закрепление результата',
                description: 'Интеграция изменений и поддержка достигнутого',
                duration: 'Постоянно',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex gap-6 items-start animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground mb-2">{item.description}</p>
                  <p className="text-sm text-primary font-medium">{item.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="results" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Результаты клиентов</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Средние показатели улучшения за 3 месяца работы
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { label: 'Уровень энергии', value: 85, icon: 'Zap' },
              { label: 'Эмоциональное состояние', value: 78, icon: 'Smile' },
              { label: 'Качество сна', value: 90, icon: 'Moon' },
              { label: 'Общее самочувствие', value: 82, icon: 'Heart' },
            ].map((item, index) => (
              <Card
                key={index}
                className="border-none shadow-lg animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-xl">{item.label}</CardTitle>
                    <Icon name={item.icon} className="text-primary" size={28} />
                  </div>
                  <Progress value={item.value} className="h-3" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">{item.value}%</p>
                  <p className="text-sm text-muted-foreground">улучшение показателей</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Отзывы клиентов</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Анна М.',
                text: 'После трёх месяцев работы я наконец-то чувствую себя живой. Энергия вернулась, сон наладился, и я снова радуюсь жизни.',
                rating: 5,
              },
              {
                name: 'Дмитрий К.',
                text: 'Методика помогла мне разобраться с хроническими болями, которые мучили меня годами. Благодарен за профессионализм.',
                rating: 5,
              },
              {
                name: 'Елена В.',
                text: 'Удивительно, как быстро начались изменения. Уже через месяц я заметила значительные улучшения в общем самочувствии.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon key={i} name="Star" className="text-primary fill-primary" size={20} />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Запись на консультацию</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Выберите удобную дату и время для первой встречи
          </p>
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Выберите дату и время</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ваше имя *</label>
                  <Input
                    placeholder="Введите ваше имя"
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email *</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={bookingEmail}
                    onChange={(e) => setBookingEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Телефон</label>
                  <Input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                  />
                </div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-xl border shadow-sm mx-auto"
                />
                <div>
                  <p className="text-sm font-medium mb-3">Доступное время:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        onClick={() => setSelectedTime(time)}
                        className="w-full"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button onClick={handleBooking} className="w-full" size="lg">
                  Записаться
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Или свяжитесь с нами</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ваше имя *</label>
                  <Input
                    placeholder="Введите ваше имя"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email *</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Телефон</label>
                  <Input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Сообщение *</label>
                  <Textarea
                    placeholder="Расскажите о вашем запросе..."
                    rows={5}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  />
                </div>
                <Button onClick={handleContactSubmit} className="w-full" size="lg">
                  Отправить сообщение
                </Button>
                <div className="pt-6 space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Icon name="Mail" size={20} />
                    <span>info@healing-method.ru</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Icon name="Phone" size={20} />
                    <span>+7 (999) 123-45-67</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Icon name="MapPin" size={20} />
                    <span>Москва, ул. Примерная, д. 1</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground mb-4">
            © 2024 Методика восстановления и самоисцеления. Все права защищены.
          </p>
          <div className="flex justify-center gap-6">
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <Icon name="Instagram" size={24} />
            </button>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <Icon name="Facebook" size={24} />
            </button>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <Icon name="Youtube" size={24} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;