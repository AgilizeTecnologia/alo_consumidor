import React, { useState } from 'react';
import { BookOpen, GraduationCap, Lock, User, Award, Clock, BarChart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Dados dos cursos
const courses = {
  direitoConsumidor: [
    {
      id: 1,
      title: 'Introdução ao Direito do Consumidor',
      level: 'Básico',
      duration: '4 horas',
      description: 'Aprenda os conceitos fundamentais do Código de Defesa do Consumidor e seus direitos básicos.',
      topics: ['CDC Básico', 'Direitos Fundamentais', 'Relação de Consumo', 'Garantias']
    },
    {
      id: 2,
      title: 'Direitos e Deveres do Consumidor',
      level: 'Médio',
      duration: '8 horas',
      description: 'Aprofunde-se nos direitos e deveres, práticas comerciais e responsabilidade civil.',
      topics: ['Práticas Comerciais', 'Responsabilidade Civil', 'Vícios e Defeitos', 'Recall']
    },
    {
      id: 3,
      title: 'Defesa do Consumidor Avançada',
      level: 'Avançado',
      duration: '12 horas',
      description: 'Estudo avançado sobre jurisprudência, ações coletivas e procedimentos administrativos.',
      topics: ['Jurisprudência', 'Ações Coletivas', 'Procedimentos Administrativos', 'Mediação']
    }
  ],
  informaticaTecnologia: [
    {
      id: 4,
      title: 'Proteção de Dados Pessoais - LGPD',
      level: 'Básico',
      duration: '5 horas',
      description: 'Entenda a Lei Geral de Proteção de Dados e como proteger suas informações pessoais.',
      topics: ['LGPD Básica', 'Direitos do Titular', 'Consentimento', 'Segurança Digital']
    },
    {
      id: 5,
      title: 'Comércio Eletrônico e Direitos Digitais',
      level: 'Médio',
      duration: '8 horas',
      description: 'Aprenda sobre compras online, direito de arrependimento e segurança em transações digitais.',
      topics: ['E-commerce', 'Direito de Arrependimento', 'Segurança Online', 'Fraudes Digitais']
    },
    {
      id: 6,
      title: 'Crimes Cibernéticos e Proteção Digital',
      level: 'Avançado',
      duration: '10 horas',
      description: 'Estudo aprofundado sobre crimes digitais, proteção de dados e Marco Civil da Internet.',
      topics: ['Crimes Cibernéticos', 'Marco Civil', 'Privacidade Digital', 'Perícia Digital']
    }
  ]
};

function PortalCursos() {
  const [accessMode, setAccessMode] = useState(null); // 'knowledge' ou 'diploma'
  const [selectedCategory, setSelectedCategory] = useState('direitoConsumidor');

  const handleAccessModeSelection = (mode) => {
    if (mode === 'diploma') {
      alert('Para obter diploma, você precisa fazer login. Redirecionando para a página de login...');
      return;
    }
    setAccessMode(mode);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Básico':
        return 'bg-green-500';
      case 'Médio':
        return 'bg-yellow-500';
      case 'Avançado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
          <span className={`${getLevelColor(course.level)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
            {course.level}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Clock className="w-4 h-4" />
          {course.duration}
        </div>
        <p className="text-sm text-gray-600 mb-4">{course.description}</p>
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Tópicos abordados:</p>
          <div className="flex flex-wrap gap-2">
            {course.topics.map((topic, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-300">
                {topic}
              </span>
            ))}
          </div>
        </div>
        <button 
          onClick={() => alert(`Iniciando curso: ${course.title}`)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          {accessMode === 'diploma' ? 'Iniciar Curso com Certificação' : 'Acessar Conteúdo'}
        </button>
      </div>
    </div>
  );

  // Tela de seleção de modo de acesso
  if (!accessMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <Link to="/" className="text-blue-600 hover:underline flex items-center mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para a Página Inicial
          </Link>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Portal de Cursos - Alô Consumidor
            </h1>
            <p className="text-lg text-gray-600">
              Escolha como deseja acessar nossos cursos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Opção: Apenas Conhecimento */}
            <div 
              onClick={() => handleAccessModeSelection('knowledge')}
              className="bg-white rounded-lg border-2 border-blue-500 hover:border-blue-600 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer p-6"
            >
              <div className="text-center pb-4">
                <div className="mx-auto mb-4 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Acesso para Conhecimento</h2>
              </div>
              <div className="text-center">
                <p className="text-base text-gray-600 mb-6">
                  Acesse todos os cursos gratuitamente para aprender e expandir seus conhecimentos sobre direito do consumidor e tecnologia.
                </p>
                <ul className="text-sm text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Acesso imediato a todos os conteúdos
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Sem necessidade de cadastro
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Materiais de apoio disponíveis
                  </li>
                </ul>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                  Começar Agora
                </button>
              </div>
            </div>

            {/* Opção: Com Diploma */}
            <div 
              onClick={() => handleAccessModeSelection('diploma')}
              className="bg-white rounded-lg border-2 border-green-500 hover:border-green-600 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer p-6"
            >
              <div className="text-center pb-4">
                <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Acesso com Certificação</h2>
              </div>
              <div className="text-center">
                <p className="text-base text-gray-600 mb-6">
                  Faça login para acessar os cursos e obter certificados oficiais ao concluir cada módulo.
                </p>
                <ul className="text-sm text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-green-600" />
                    Certificado oficial ao concluir
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart className="w-4 h-4 text-green-600" />
                    Acompanhamento de progresso
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    Requer login e cadastro
                  </li>
                </ul>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                  <User className="w-4 h-4" />
                  Fazer Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela de cursos
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Portal de Cursos</h1>
            <p className="text-sm text-gray-600">
              {accessMode === 'diploma' ? 'Modo: Certificação' : 'Modo: Conhecimento'}
            </p>
          </div>
          <button 
            onClick={() => setAccessMode(null)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Alterar Modo de Acesso
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="w-full">
          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setSelectedCategory('direitoConsumidor')}
              className={`px-6 py-2 font-semibold rounded-lg transition-colors duration-200 ${
                selectedCategory === 'direitoConsumidor'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Direito do Consumidor
            </button>
            <button
              onClick={() => setSelectedCategory('informaticaTecnologia')}
              className={`px-6 py-2 font-semibold rounded-lg transition-colors duration-200 ${
                selectedCategory === 'informaticaTecnologia'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Informática e Tecnologia
            </button>
          </div>

          {/* Content */}
          {selectedCategory === 'direitoConsumidor' && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Cursos de Direito do Consumidor</h2>
                <p className="text-gray-600">
                  Aprenda sobre seus direitos e como se proteger nas relações de consumo
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.direitoConsumidor.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}

          {selectedCategory === 'informaticaTecnologia' && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Cursos de Informática e Tecnologia</h2>
                <p className="text-gray-600">
                  Proteja-se no mundo digital e entenda seus direitos na era da informação
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.informaticaTecnologia.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Alô Consumidor - Governo do Distrito Federal</p>
          <p className="text-sm mt-2">Secretaria de Defesa do Consumidor do D.F</p>
        </div>
      </footer>
    </div>
  );
}

export default PortalCursos;

