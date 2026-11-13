import { useState, useRef, useEffect, useCallback } from 'react';
import { pontos, linhasTrabalho, ritmos, Ponto } from './data/pontos';

function App() {
  const [linhaSelecionada, setLinhaSelecionada] = useState<string>('Todas');
  const [ritmoSelecionado, setRitmoSelecionado] = useState<string>('Todos');
  const [pontoSelecionado, setPontoSelecionado] = useState<Ponto | null>(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [busca, setBusca] = useState('');
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const letraRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  const pontosFiltrados = pontos.filter((p) => {
    const matchLinha = linhaSelecionada === 'Todas' || p.linha === linhaSelecionada;
    const matchRitmo = ritmoSelecionado === 'Todos' || p.ritmo === ritmoSelecionado;
    const matchBusca =
      busca === '' ||
      p.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      p.letra.join(' ').toLowerCase().includes(busca.toLowerCase());
    return matchLinha && matchRitmo && matchBusca;
  });

  const toggleAutoScroll = useCallback(() => {
    setAutoScroll((prev) => !prev);
  }, []);

  useEffect(() => {
    if (autoScroll && letraRef.current) {
      scrollIntervalRef.current = window.setInterval(() => {
        if (letraRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = letraRef.current;
          if (scrollTop + clientHeight >= scrollHeight - 5) {
            // Chegou ao final, volta ao início
            letraRef.current.scrollTop = 0;
          } else {
            letraRef.current.scrollTop += scrollSpeed;
          }
        }
      }, 30);
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [autoScroll, scrollSpeed]);

  const handleSelectPonto = (ponto: Ponto) => {
    setPontoSelecionado(ponto);
    setAutoScroll(false);
    setSidebarAberta(false);
    if (letraRef.current) {
      letraRef.current.scrollTop = 0;
    }
  };

  const getLinhaColor = (linha: string) => {
    const colors: Record<string, string> = {
      Caboclo: 'bg-green-600',
      Exu: 'bg-red-700',
      'Pomba Gira': 'bg-pink-600',
      'Pretos Velhos': 'bg-amber-700',
      Crianças: 'bg-yellow-500',
      Baianos: 'bg-orange-600',
      Marinheiros: 'bg-blue-600',
      Oxalá: 'bg-white',
      Oxum: 'bg-yellow-400',
      Ogum: 'bg-red-500',
      Oxóssi: 'bg-emerald-600',
      Xangô: 'bg-amber-600',
      Iemanjá: 'bg-cyan-500',
      Nanã: 'bg-purple-700',
    };
    return colors[linha] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-purple-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-purple-800/50 transition-colors"
              onClick={() => setSidebarAberta(!sidebarAberta)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🕯️</span>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
                  Terreiro Digital
                </h1>
                <p className="text-xs text-purple-300 hidden sm:block">Repositório de Pontos Cantados</p>
              </div>
            </div>
          </div>

          {pontoSelecionado && (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <label className="text-xs text-purple-300">Velocidade:</label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.5"
                  value={scrollSpeed}
                  onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
                  className="w-20 accent-amber-400"
                />
              </div>
              <button
                onClick={toggleAutoScroll}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  autoScroll
                    ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/30 animate-pulse'
                    : 'bg-purple-700 hover:bg-purple-600 text-white'
                }`}
              >
                {autoScroll ? '⏸ Pausar' : '▶ Rolagem'}
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-[65px] left-0 z-40 h-[calc(100vh-65px)] w-72 bg-gray-900/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border-r border-purple-800/30 overflow-y-auto transition-transform lg:translate-x-0 ${
            sidebarAberta ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-6">
            {/* Busca */}
            <div>
              <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2 block">
                Buscar
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar ponto..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/80 border border-purple-700/50 rounded-lg text-sm text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                />
              </div>
            </div>

            {/* Linhas de Trabalho */}
            <div>
              <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2 block">
                Linha de Trabalho
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setLinhaSelecionada('Todas')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    linhaSelecionada === 'Todas'
                      ? 'bg-purple-700/80 text-white font-medium'
                      : 'text-purple-200 hover:bg-purple-800/40'
                  }`}
                >
                  Todas ({pontos.length})
                </button>
                {linhasTrabalho.map((linha) => {
                  const count = pontos.filter((p) => p.linha === linha).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={linha}
                      onClick={() => setLinhaSelecionada(linha)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                        linhaSelecionada === linha
                          ? 'bg-purple-700/80 text-white font-medium'
                          : 'text-purple-200 hover:bg-purple-800/40'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${getLinhaColor(linha)}`}></span>
                      {linha} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ritmos */}
            <div>
              <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2 block">
                Ritmo
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setRitmoSelecionado('Todos')}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                    ritmoSelecionado === 'Todos'
                      ? 'bg-amber-500 text-gray-900 font-medium'
                      : 'bg-gray-800 text-purple-200 hover:bg-gray-700'
                  }`}
                >
                  Todos
                </button>
                {ritmos.map((ritmo) => {
                  const count = pontos.filter((p) => p.ritmo === ritmo).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={ritmo}
                      onClick={() => setRitmoSelecionado(ritmo)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        ritmoSelecionado === ritmo
                          ? 'bg-amber-500 text-gray-900 font-medium'
                          : 'bg-gray-800 text-purple-200 hover:bg-gray-700'
                      }`}
                    >
                      {ritmo}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay para mobile */}
        {sidebarAberta && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarAberta(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-65px)] p-4 lg:p-6">
          {!pontoSelecionado ? (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-amber-300 mb-1">Pontos Cantados</h2>
                <p className="text-purple-300 text-sm">
                  Selecione um ponto para ver a letra • {pontosFiltrados.length} ponto(s) encontrado(s)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pontosFiltrados.map((ponto) => (
                  <button
                    key={ponto.id}
                    onClick={() => handleSelectPonto(ponto)}
                    className="group text-left p-4 bg-gray-800/60 border border-purple-700/30 rounded-xl hover:bg-gray-800/90 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-purple-900/50 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-white group-hover:text-amber-300 transition-colors leading-tight">
                        {ponto.titulo}
                      </h3>
                      <span className={`shrink-0 w-3 h-3 rounded-full ${getLinhaColor(ponto.linha)}`}></span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-800/60 text-purple-200">
                        {ponto.linha}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-900/40 text-amber-300">
                        ♪ {ponto.ritmo}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-purple-400 line-clamp-2 leading-relaxed">
                      {ponto.letra[0]}
                      {ponto.letra[2] && ` / ${ponto.letra[2]}`}
                    </p>
                  </button>
                ))}
              </div>

              {pontosFiltrados.length === 0 && (
                <div className="text-center py-16">
                  <span className="text-5xl mb-4 block">🔮</span>
                  <p className="text-purple-300 text-lg">Nenhum ponto encontrado</p>
                  <p className="text-purple-400 text-sm mt-1">Tente ajustar os filtros</p>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {/* Ponto Header */}
              <div className="mb-6">
                <button
                  onClick={() => setPontoSelecionado(null)}
                  className="flex items-center gap-2 text-purple-300 hover:text-amber-300 transition-colors mb-4 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Voltar à lista
                </button>

                <div className="bg-gray-800/60 border border-purple-700/30 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`w-4 h-4 rounded-full ${getLinhaColor(pontoSelecionado.linha)}`}></span>
                    <h2 className="text-2xl font-bold text-amber-300">{pontoSelecionado.titulo}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-800/60 text-purple-200">
                      🏛️ {pontoSelecionado.linha}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-900/40 text-amber-300">
                      ♪ {pontoSelecionado.ritmo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Letra com rolagem */}
              <div
                ref={letraRef}
                className="bg-gray-800/40 border border-purple-700/20 rounded-2xl p-8 overflow-y-auto relative"
                style={{ height: 'calc(100vh - 320px)', minHeight: '300px' }}
              >
                {autoScroll && (
                  <div className="absolute top-3 right-3 flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-3 py-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span className="text-xs text-amber-300">Rolagem automática</span>
                  </div>
                )}

                <div className="space-y-1">
                  {pontoSelecionado.letra.map((linha, index) => (
                    <p
                      key={index}
                      className={`text-lg leading-relaxed font-serif ${
                        linha === ''
                          ? 'h-6'
                          : linha.startsWith('Sarava') || linha.startsWith('Laroyê') || linha.startsWith('Adorei') || linha.startsWith('Salve') || linha.startsWith('Okê') || linha.startsWith('Kaô') || linha.startsWith('Odô') || linha.startsWith('Saluba') || linha.startsWith('Ore') || linha.startsWith('Êpa')
                          ? 'text-amber-300 font-semibold italic'
                          : 'text-purple-100'
                      }`}
                    >
                      {linha || '\u00A0'}
                    </p>
                  ))}
                </div>
              </div>

              {/* Controles de rolagem mobile */}
              <div className="mt-4 flex items-center justify-between md:hidden">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-purple-300">Vel:</label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.5"
                    value={scrollSpeed}
                    onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
                    className="w-24 accent-amber-400"
                  />
                </div>
                <button
                  onClick={toggleAutoScroll}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    autoScroll
                      ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/30'
                      : 'bg-purple-700 hover:bg-purple-600 text-white'
                  }`}
                >
                  {autoScroll ? '⏸ Pausar' : '▶ Rolar'}
                </button>
              </div>

              {/* Navegação entre pontos */}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => {
                    const idx = pontosFiltrados.findIndex((p) => p.id === pontoSelecionado.id);
                    if (idx > 0) handleSelectPonto(pontosFiltrados[idx - 1]);
                  }}
                  disabled={pontosFiltrados.findIndex((p) => p.id === pontoSelecionado.id) === 0}
                  className="px-4 py-2 rounded-lg bg-gray-800/60 border border-purple-700/30 text-purple-200 hover:bg-purple-800/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => {
                    const idx = pontosFiltrados.findIndex((p) => p.id === pontoSelecionado.id);
                    if (idx < pontosFiltrados.length - 1) handleSelectPonto(pontosFiltrados[idx + 1]);
                  }}
                  disabled={
                    pontosFiltrados.findIndex((p) => p.id === pontoSelecionado.id) ===
                    pontosFiltrados.length - 1
                  }
                  className="px-4 py-2 rounded-lg bg-gray-800/60 border border-purple-700/30 text-purple-200 hover:bg-purple-800/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Próximo →
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-800/30 py-4 text-center text-xs text-purple-400 mt-8">
        <p>🕯️ Terreiro Digital — Repositório de Pontos Cantados de Umbanda</p>
        <p className="mt-1 text-purple-500">Feito com fé e respeito às tradições</p>
      </footer>
    </div>
  );
}

export default App;
