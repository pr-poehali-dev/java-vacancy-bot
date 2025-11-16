import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  description: string;
  tags: string[];
  distance?: string;
}

const mockJobs: Job[] = [
  {
    id: 1,
    title: 'Senior Java Developer',
    company: 'Яндекс',
    location: 'Москва, Россия',
    salary: '300 000 - 450 000 ₽',
    experience: '5+ лет',
    description: 'Разработка высоконагруженных микросервисов на Java',
    tags: ['Spring Boot', 'Kafka', 'PostgreSQL', 'Docker'],
    distance: '2.3 км'
  },
  {
    id: 2,
    title: 'Middle Java Developer',
    company: 'Сбер',
    location: 'Москва, Россия',
    salary: '200 000 - 300 000 ₽',
    experience: '3-5 лет',
    description: 'Разработка банковских сервисов',
    tags: ['Spring', 'Hibernate', 'Oracle', 'Kubernetes'],
    distance: '5.1 км'
  },
  {
    id: 3,
    title: 'Java Team Lead',
    company: 'VK',
    location: 'Санкт-Петербург, Россия',
    salary: '350 000 - 500 000 ₽',
    experience: '7+ лет',
    description: 'Управление командой разработки',
    tags: ['Java', 'Architecture', 'Management', 'Microservices'],
    distance: '650 км'
  },
  {
    id: 4,
    title: 'Junior Java Developer',
    company: 'Ozon',
    location: 'Москва, Россия',
    salary: '100 000 - 150 000 ₽',
    experience: '0-1 год',
    description: 'Разработка e-commerce платформы',
    tags: ['Java', 'Spring', 'REST API', 'Git'],
    distance: '3.7 км'
  }
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [salaryRange, setSalaryRange] = useState([0]);
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);

  const handleSearch = () => {
    let results = mockJobs;

    if (searchQuery) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (experienceFilter !== 'all') {
      results = results.filter(job => {
        const exp = job.experience.toLowerCase();
        if (experienceFilter === 'junior') return exp.includes('0-1') || exp.includes('junior');
        if (experienceFilter === 'middle') return exp.includes('3-5') || exp.includes('middle');
        if (experienceFilter === 'senior') return exp.includes('5+') || exp.includes('7+') || exp.includes('senior');
        return true;
      });
    }

    const minSalary = salaryRange[0] * 1000;
    if (minSalary > 0) {
      results = results.filter(job => {
        const salary = parseInt(job.salary.replace(/\D/g, ''));
        return salary >= minSalary;
      });
    }

    setFilteredJobs(results);
  };

  const enableLocation = () => {
    setLocationEnabled(true);
    const sorted = [...filteredJobs].sort((a, b) => {
      const distA = parseFloat(a.distance || '1000');
      const distB = parseFloat(b.distance || '1000');
      return distA - distB;
    });
    setFilteredJobs(sorted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name="Briefcase" size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-3">
            Java Jobs Bot
          </h1>
          <p className="text-xl text-muted-foreground">
            Найди работу мечты рядом с тобой 🚀
          </p>
        </header>

        <div className="grid gap-6 mb-8 animate-slide-up">
          <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Search" size={24} className="text-primary" />
                Поиск вакансий
              </CardTitle>
              <CardDescription>Введите должность или технологию</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="Spring Boot, Kafka, Senior..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-lg"
                />
                <Button onClick={handleSearch} size="lg" className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  <Icon name="Search" size={20} />
                  Найти
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="SlidersHorizontal" size={24} className="text-secondary" />
                Фильтры
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                    <Icon name="DollarSign" size={18} className="text-accent" />
                    Минимальная зарплата: {salaryRange[0]}k ₽
                  </label>
                  <Slider
                    value={salaryRange}
                    onValueChange={(value) => {
                      setSalaryRange(value);
                      handleSearch();
                    }}
                    max={500}
                    step={50}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                    <Icon name="TrendingUp" size={18} className="text-accent" />
                    Опыт работы
                  </label>
                  <Select value={experienceFilter} onValueChange={(value) => {
                    setExperienceFilter(value);
                    setTimeout(handleSearch, 100);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите уровень" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Любой опыт</SelectItem>
                      <SelectItem value="junior">Junior (0-1 год)</SelectItem>
                      <SelectItem value="middle">Middle (3-5 лет)</SelectItem>
                      <SelectItem value="senior">Senior (5+ лет)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant={locationEnabled ? "default" : "outline"}
                  onClick={enableLocation}
                  className="flex-1 gap-2"
                >
                  <Icon name={locationEnabled ? "MapPinned" : "MapPin"} size={20} />
                  {locationEnabled ? '📍 Рядом со мной' : 'Включить геолокацию'}
                </Button>
                <Button
                  variant={notificationsEnabled ? "default" : "outline"}
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className="flex-1 gap-2"
                >
                  <Icon name={notificationsEnabled ? "BellRing" : "Bell"} size={20} />
                  {notificationsEnabled ? '🔔 Уведомления вкл' : 'Уведомления'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Icon name="Sparkles" size={24} className="text-primary" />
            Найдено вакансий: {filteredJobs.length}
          </h2>
          {locationEnabled && (
            <Badge variant="secondary" className="gap-1">
              <Icon name="MapPin" size={14} />
              Сортировка по расстоянию
            </Badge>
          )}
        </div>

        <div className="grid gap-6">
          {filteredJobs.map((job, index) => (
            <Card 
              key={job.id} 
              className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary cursor-pointer group animate-fade-in hover:scale-[1.02]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                      {job.title}
                    </CardTitle>
                    <CardDescription className="text-lg font-medium text-foreground/80">
                      🏢 {job.company}
                    </CardDescription>
                  </div>
                  <Badge className="bg-gradient-to-r from-primary to-secondary text-white text-lg px-4 py-2">
                    {job.salary}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Icon name="MapPin" size={16} className="text-secondary" />
                      {job.location}
                    </div>
                    {locationEnabled && job.distance && (
                      <Badge variant="outline" className="gap-1">
                        <Icon name="Navigation" size={12} />
                        {job.distance}
                      </Badge>
                    )}
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Icon name="Clock" size={16} className="text-accent" />
                      {job.experience}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="hover:bg-primary hover:text-white transition-colors">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                      <Icon name="Send" size={18} />
                      Откликнуться
                    </Button>
                    <Button variant="outline" className="gap-2 hover:bg-accent hover:text-white hover:border-accent">
                      <Icon name="Bookmark" size={18} />
                      Сохранить
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">😕</div>
              <h3 className="text-2xl font-semibold mb-2">Вакансии не найдены</h3>
              <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
