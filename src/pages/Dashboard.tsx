import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const APPOINTMENTS_API = 'https://functions.poehali.dev/db2ade7f-6bfc-47d7-b2e0-fe51bd2fd0b9';
const PROGRESS_API = 'https://functions.poehali.dev/b4f18f39-08cb-413b-8076-ebe9b64217b5';

const Dashboard = () => {
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [progressData, setProgressData] = useState<any>({});
  const [newMetrics, setNewMetrics] = useState({
    'Уровень энергии': 50,
    'Эмоциональное состояние': 50,
    'Качество сна': 50,
    'Общее самочувствие': 50,
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setIsLoggedIn(true);
      loadDashboardData(savedEmail);
    }
  }, []);

  const loadDashboardData = async (userEmail: string) => {
    try {
      const appointmentsRes = await fetch(`${APPOINTMENTS_API}?email=${userEmail}`);
      const appointmentsData = await appointmentsRes.json();
      setAppointments(appointmentsData.appointments || []);

      const progressRes = await fetch(`${PROGRESS_API}?email=${userEmail}`);
      const progressDataRes = await progressRes.json();
      setProgressData(progressDataRes);

      if (progressDataRes.latestMetrics && Object.keys(progressDataRes.latestMetrics).length > 0) {
        setNewMetrics(progressDataRes.latestMetrics);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleLogin = () => {
    if (!email) {
      toast({
        title: 'Ошибка',
        description: 'Введите email',
        variant: 'destructive',
      });
      return;
    }
    localStorage.setItem('userEmail', email);
    setIsLoggedIn(true);
    loadDashboardData(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setEmail('');
    setAppointments([]);
    setProgressData({});
    navigate('/');
  };

  const handleSaveProgress = async () => {
    try {
      const response = await fetch(PROGRESS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          metrics: newMetrics,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Успешно!',
          description: 'Прогресс сохранён',
        });
        loadDashboardData(email);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить прогресс',
        variant: 'destructive',
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-secondary/20 to-white flex items-center justify-center px-6">
        <Card className="w-full max-w-md border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Личный кабинет</CardTitle>
            <CardDescription className="text-center">
              Войдите, используя email, указанный при записи
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full" size="lg">
              Войти
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              Вернуться на главную
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-secondary/20 to-white">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Личный кабинет</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{email}</span>
              <Button variant="outline" onClick={handleLogout}>
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="progress" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="progress">
                <Icon name="TrendingUp" className="mr-2" size={20} />
                Мой прогресс
              </TabsTrigger>
              <TabsTrigger value="appointments">
                <Icon name="Calendar" className="mr-2" size={20} />
                Мои записи
              </TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-8">
              <Card className="border-none shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Отслеживание прогресса</CardTitle>
                  <CardDescription>
                    Оцените своё текущее состояние по каждому показателю
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(newMetrics).map(([metric, value]) => (
                    <div key={metric}>
                      <div className="flex justify-between items-center mb-3">
                        <label className="font-medium">{metric}</label>
                        <span className="text-2xl font-bold text-primary">{value}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) =>
                          setNewMetrics((prev) => ({
                            ...prev,
                            [metric]: parseInt(e.target.value),
                          }))
                        }
                        className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${value}%, hsl(var(--muted)) ${value}%, hsl(var(--muted)) 100%)`,
                        }}
                      />
                    </div>
                  ))}
                  <Button onClick={handleSaveProgress} className="w-full" size="lg">
                    Сохранить прогресс
                  </Button>
                </CardContent>
              </Card>

              {progressData.history && Object.keys(progressData.history).length > 0 && (
                <Card className="border-none shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl">История изменений</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(progressData.history).map(([metric, history]: [string, any]) => (
                        <div key={metric}>
                          <h3 className="font-semibold mb-2">{metric}</h3>
                          <div className="space-y-2">
                            {history.slice(0, 5).map((entry: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center text-sm bg-muted/50 p-3 rounded-lg"
                              >
                                <span className="text-muted-foreground">
                                  {new Date(entry.date).toLocaleDateString('ru-RU')}
                                </span>
                                <div className="flex items-center gap-3">
                                  <Progress value={entry.value} className="w-32 h-2" />
                                  <span className="font-medium w-12 text-right">{entry.value}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="appointments" className="space-y-4">
              {appointments.length === 0 ? (
                <Card className="border-none shadow-xl">
                  <CardContent className="py-12 text-center">
                    <Icon name="Calendar" className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <p className="text-lg text-muted-foreground">У вас пока нет записей</p>
                    <Button onClick={() => navigate('/')} className="mt-6">
                      Записаться на консультацию
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {appointments.map((appointment: any) => (
                    <Card key={appointment.id} className="border-none shadow-lg">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">
                              {new Date(appointment.date).toLocaleDateString('ru-RU', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </CardTitle>
                            <CardDescription className="text-lg mt-1">
                              Время: {appointment.time}
                            </CardDescription>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              appointment.status === 'scheduled'
                                ? 'bg-primary/10 text-primary'
                                : appointment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {appointment.status === 'scheduled'
                              ? 'Запланировано'
                              : appointment.status === 'completed'
                              ? 'Завершено'
                              : 'Отменено'}
                          </div>
                        </div>
                      </CardHeader>
                      {appointment.notes && (
                        <CardContent>
                          <p className="text-muted-foreground">{appointment.notes}</p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
