import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const APPOINTMENTS_API = 'https://functions.poehali.dev/db2ade7f-6bfc-47d7-b2e0-fe51bd2fd0b9';
const CONTACT_API = 'https://functions.poehali.dev/6cfa1325-568d-43e5-8af3-46c6fe12c307';

export const ContactSection = () => {
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

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

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
  );
};
