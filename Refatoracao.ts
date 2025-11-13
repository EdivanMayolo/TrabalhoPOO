// CÓDIGO PROPOSITALMENTE RUIM PARA ATIVIDADE DE REFATORAÇÃO
// Sistema de Gerenciamento de Biblioteca

//criação de interfaces para a classe BibliotecaManager, usando Abstração
//para substiir any
interface Livro {
  id: number; titulo: string; autor: string; ano: number;
  quantidade: number; disponiveis: number; categoria: string; preco: number;
}
interface Usuario {
  id: number; nome: string; cpf: string; tipo: string; // "estudante" | "professor" | "comum"
  ativo: boolean; multas: number; telefone: string;
}
interface Emprestimo {
  id: number; usuarioId: number; livroId: number;
  dataEmprestimo: Date; dataDevolucao: Date;
  diasPermitidos: number; taxaMultaDiaria: number;
  devolvido: boolean; tipo: string;
  dataDevolucaoReal?: Date; multa?: number;
}
interface Reserva {
  usuarioId: number; livroId: number; ativo: boolean;
}
//Encapsulamento, deixado todos os atributos privados
//feito o usuo do _ para indicar campo interno
class BibliotecaManager {
  private _livros: Livro[] = [];
  private _usuarios: Usuario[] = [];
  private _emprestimos: Emprestimo[] = [];
  private _reservas: Reserva[] = [];
//Getters de leitura 
  public get livros(): Livro[] { return [...this._livros]; }
  public get usuarios(): Usuario[] { return [...this._usuarios]; }
  public get emprestimos(): Emprestimo[] { return [...this._emprestimos]; }
  public get reservas(): Reserva[] { return [...this._reservas]; }

  constructor() {
    this._livros.push(
      { id: 1, titulo: "Clean Code", autor: "Robert Martin", ano: 2008, quantidade: 3, disponiveis: 3, categoria: "tecnologia", preco: 89.90 },
      { id: 2, titulo: "1984", autor: "George Orwell", ano: 1949, quantidade: 2, disponiveis: 2, categoria: "ficcao", preco: 45.00 },
      { id: 3, titulo: "Sapiens", autor: "Yuval Harari", ano: 2011, quantidade: 4, disponiveis: 4, categoria: "historia", preco: 65.50 },
      { id: 4, titulo: "O Hobbit", autor: "Tolkien", ano: 1937, quantidade: 2, disponiveis: 2, categoria: "fantasia", preco: 55.00 }
    );
    this._usuarios.push(
      { id: 1, nome: "Ana Silva",      cpf: "12345678901", tipo: "estudante", ativo: true,  multas: 0,     telefone: "48999999999" },
      { id: 2, nome: "Carlos Santos",  cpf: "98765432100", tipo: "professor", ativo: true,  multas: 15.50, telefone: "48988888888" },
      { id: 3, nome: "Beatriz Costa",  cpf: "11122233344", tipo: "comum",     ativo: false, multas: 0,     telefone: "48977777777" }
    );
  }
//Encapsulamento - Busca mais segura
  private findUsuarioById(id: number): Usuario | undefined {
    return this._usuarios.find(u => u.id === id);
  }
//Encapsulamento - Busca mais segura
  private findLivroById(id: number): Livro | undefined {
    return this._livros.find(l => l.id === id);
  }
//Coesão || Contar empréstimos abertos
  private contaEmprestimosAtivos(usuarioId: number): number {
    return this._emprestimos.filter(e => e.usuarioId === usuarioId && !e.devolvido).length;
  }
//Polimorfismo por dados por tipo de usuário
  private limitesPorTipo(tipo: string): { dias: number; multaDia: number; limite: number } {
    if (tipo === "estudante") return { dias: 14, multaDia: 0.50, limite: 3 };
    if (tipo === "professor") return { dias: 30, multaDia: 0.30, limite: 5 };
    return { dias: 7, multaDia: 1.00, limite: 2 }; // comum
  }
//Encapsulamento + Abstração | validações + coesas para validação do usuario
  private validarUsuario(usuario: Usuario | undefined): string | null {
    if (!usuario) return "Usuário não encontrado!";
    if (!usuario.ativo) return "Usuário inativo!";
    if (usuario.multas > 0) return "Usuário possui multas pendentes de R$" + usuario.multas.toFixed(2);
    return null;
  }
//Encapsulamento + Abstração | validações + coesas para validação do livro
  private validarLivro(livro: Livro | undefined): string | null {
    if (!livro) return "Livro não encontrado!";
    if (livro.disponiveis <= 0) return "Livro indisponível no momento!";
    return null;
  }
  //Aqui
  
  // Problema 3: Método gigante que faz TUDO
//Usando Abstraçao
 public realizarEmprestimo(usuarioId: number, livroId: number, dias: number, tipoEmprestimo: string) {
    console.log("\n=== PROCESSANDO EMPRÉSTIMO ===");
//Encapsulamento + Abstração
    const usuario = this.findUsuarioById(usuarioId);
    const erroU = this.validarUsuario(usuario);
    if (erroU) { console.log("ERRO: " + erroU); return; }

    const livro = this.findLivroById(livroId);
    const erroL = this.validarLivro(livro);
    if (erroL) { console.log("ERRO: " + erroL); return; }

//Polimorfismo por dados
    let diasPermitidos = 0;
    let taxaMultaDiaria = 0;
    if (tipoEmprestimo === "normal" || tipoEmprestimo === "renovacao") {
      const base = this.limitesPorTipo(usuario!.tipo);
      diasPermitidos = tipoEmprestimo === "normal" ? base.dias : Math.ceil(base.dias / 2);
      taxaMultaDiaria = base.multaDia;
    } else if (tipoEmprestimo === "expresso") {
      diasPermitidos = 1; taxaMultaDiaria = 5.00;
      console.log("Empréstimo expresso (24h). Taxa extra de R$2.00 será cobrada");
    } else { console.log("ERRO: Tipo de empréstimo inválido!"); return; }

    if (dias > diasPermitidos) {
      console.log("ERRO: Período solicitado (" + dias + " dias) excede o permitido (" + diasPermitidos + " dias)");
      return;
    }

    const ativos = this.contaEmprestimosAtivos(usuarioId);
    const limite = this.limitesPorTipo(usuario!.tipo).limite;
    if (ativos >= limite) {
      console.log("ERRO: Usuário já atingiu o limite de " + limite + " empréstimos simultâneos!");
      return;
    }
// [Encapsulamento] atualização consistente do estoque
    livro!.disponiveis -= 1;

    const dataEmprestimo = new Date();
    const dataDevolucao = new Date();
    dataDevolucao.setDate(dataDevolucao.getDate() + dias);
//Fazendo uso de Associação(Cria o objeto Emprestimo ligando Usuario e Livro via seus IDs)
    const emprestimoId = this._emprestimos.length + 1;
//Usando composição(EMprestimo comeca a fazer parte da biblioteca)
    const novo: Emprestimo = {
      id: emprestimoId, usuarioId, livroId,
      dataEmprestimo, dataDevolucao,
      diasPermitidos: dias, taxaMultaDiaria, devolvido: false, tipo: tipoEmprestimo
    };
//Agregação(O emprestimo e 'agregado' à classe BibliotecaManager)
    this._emprestimos.push(novo);
//Impressão de EMPRESTIMOS
    console.log("Enviando notificações...");
    console.log("Email para " + usuario!.nome + ": Empréstimo realizado com sucesso!");
    console.log("SMS para " + usuario!.telefone + ": Livro '" + livro!.titulo + "' deve ser devolvido até " + dataDevolucao.toLocaleDateString());
    console.log("WhatsApp: Olá " + usuario!.nome + ", seu empréstimo foi confirmado!");
    console.log("[LOG] " + dataEmprestimo + " - Empréstimo ID " + emprestimoId + " criado");
    console.log("Total de empréstimos hoje: " + this._emprestimos.length);

    console.log("\n╔════════════════════════════════════╗");
    console.log("║     COMPROVANTE DE EMPRÉSTIMO      ║");
    console.log("╠════════════════════════════════════╣");
    console.log("║ ID: " + emprestimoId);
    console.log("║ Usuário: " + usuario!.nome);
    console.log("║ CPF: " + usuario!.cpf);
    console.log("║ Livro: " + livro!.titulo);
    console.log("║ Autor: " + livro!.autor);
    console.log("║ Data Empréstimo: " + dataEmprestimo.toLocaleDateString());
    console.log("║ Data Devolução: " + dataDevolucao.toLocaleDateString());
    console.log("║ Tipo: " + tipoEmprestimo);
    console.log("║ Multa/dia atraso: R$" + taxaMultaDiaria.toFixed(2));
    console.log("╚════════════════════════════════════╝\n");
  }
//PAREI AQUI

public realizarDevolucao(emprestimoId: number) {
    console.log("\n=== PROCESSANDO DEVOLUÇÃO ===");

    const emprestimo = this._emprestimos.find(e => e.id === emprestimoId);
    if (!emprestimo) { console.log("ERRO: Empréstimo não encontrado!"); return; }
    if (emprestimo.devolvido) { console.log("ERRO: Este livro já foi devolvido!"); return; }

    const usuario = this.findUsuarioById(emprestimo.usuarioId);
    const livro = this.findLivroById(emprestimo.livroId);
    if (!usuario || !livro) { console.log("ERRO: Dados inconsistentes do empréstimo!"); return; }

    const agora = new Date();
    const atrasoDias = Math.max(0, Math.floor((agora.getTime() - emprestimo.dataDevolucao.getTime()) / 86400000));
    const multa = atrasoDias > 0 ? atrasoDias * emprestimo.taxaMultaDiaria : 0;

    if (multa > 0) {
      console.log("ATENÇÃO: Devolução com " + atrasoDias + " dia(s) de atraso!");
      console.log("Multa calculada: R$" + multa.toFixed(2));
      usuario.multas += multa;
      console.log("Enviando notificação de multa...");
      console.log("Email: Multa de R$" + multa.toFixed(2) + " aplicada");
      console.log("SMS: Você possui multa pendente");
    } else {
      console.log("Devolução dentro do prazo. Sem multas!");
    }

    emprestimo.devolvido = true;
    emprestimo.dataDevolucaoReal = agora;
    emprestimo.multa = multa;

    livro.disponiveis += 1;

    // [Associação] reserva aponta para usuário e livro
    const reservaPendente = this._reservas.find(r => r.livroId === livro.id && r.ativo);
    if (reservaPendente) {
      const uReserva = this.findUsuarioById(reservaPendente.usuarioId);
      if (uReserva) console.log("Email para " + uReserva.nome + ": Livro '" + livro.titulo + "' está disponível!");
    }

    console.log("\n╔════════════════════════════════════╗");
    console.log("║     COMPROVANTE DE DEVOLUÇÃO       ║");
    console.log("╠════════════════════════════════════╣");
    console.log("║ Usuário: " + usuario.nome);
    console.log("║ Livro: " + livro.titulo);
    console.log("║ Data Devolução: " + agora.toLocaleDateString());
    console.log("║ Dias de Atraso: " + atrasoDias);
    console.log("║ Multa: R$" + multa.toFixed(2));
    console.log("║ Total de multas pendentes: R$" + usuario.multas.toFixed(2));
    console.log("╚════════════════════════════════════╝\n");
  }

  public gerarRelatorioCompleto() {
    console.log("\n╔═══════════════════════════════════════════════════════╗");
    console.log("║           RELATÓRIO COMPLETO DA BIBLIOTECA            ║");
    console.log("╚═══════════════════════════════════════════════════════╝\n");

    // --- ACERVO ---
    console.log("--- ACERVO DE LIVROS ---");
    let totalLivros = 0, livrosDisponiveis = 0, valorTotal = 0;
    for (const l of this._livros) {
      totalLivros += l.quantidade;
      livrosDisponiveis += l.disponiveis;
      valorTotal += l.preco * l.quantidade;
      console.log("• " + l.titulo + " - " + l.autor);
      console.log("  Disponíveis: " + l.disponiveis + "/" + l.quantidade);
      console.log("  Categoria: " + l.categoria + " | Valor: R$" + l.preco);
    }
    console.log("\nTotal de exemplares: " + totalLivros);
    console.log("Disponíveis: " + livrosDisponiveis);
    console.log("Emprestados: " + (totalLivros - livrosDisponiveis));
    console.log("Valor total do acervo: R$" + valorTotal.toFixed(2));

    // --- USUÁRIOS ---
    console.log("\n--- USUÁRIOS ---");
    let usuariosAtivos = 0, totalMultas = 0;
    for (const u of this._usuarios) {
      if (u.ativo) usuariosAtivos++;
      totalMultas += u.multas;
      console.log("• " + u.nome + " (" + u.tipo + ")");
      console.log("  Status: " + (u.ativo ? "Ativo" : "Inativo"));
      console.log("  Multas: R$" + u.multas.toFixed(2));
    }
    console.log("\nTotal de usuários: " + this._usuarios.length);
    console.log("Usuários ativos: " + usuariosAtivos);
    console.log("Total em multas: R$" + totalMultas.toFixed(2));

    // --- EMPRÉSTIMOS ---
    console.log("\n--- EMPRÉSTIMOS ---");
    let ativos = 0, atrasados = 0;
    const hoje = new Date();
    for (const e of this._emprestimos) {
      if (!e.devolvido) {
        ativos++;
        if (e.dataDevolucao < hoje) atrasados++;
      }
    }
    console.log("Total de empréstimos: " + this._emprestimos.length);
    console.log("Empréstimos ativos: " + ativos);
    console.log("Empréstimos atrasados: " + atrasados);

//Parei aqui 
    console.log("\n--- TOP 3 LIVROS MAIS EMPRESTADOS ---");
    const contagem: { [livroId: number]: number } = {};
    for (const e of this._emprestimos) {
      contagem[e.livroId] = (contagem[e.livroId] || 0) + 1;
    }
    const ranking: { id: number; count: number }[] = Object.entries(contagem)
      .map(([id, count]) => ({ id: Number(id), count: Number(count) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    let pos = 1;
    for (const item of ranking) {
      if (!item) continue;              // evita undefined no índice
      const l = this.findLivroById(item.id);
      if (!l) continue;                 // evita undefined no lookup
      console.log(pos + ". " + l.titulo + " (" + item.count + " empréstimos)");
      pos++;
    }

    console.log("\n" + "=".repeat(60) + "\n");
  }

//Encapsulamento | Setter validado
  public adicionarLivro(titulo: string, autor: string, ano: number, quantidade: number, categoria: string, preco: number) {
    if (!titulo || !autor || ano <= 0 || quantidade <= 0 || preco < 0) {
      console.log("ERRO: Dados inválidos para adicionar livro."); return;
    }
    const novoId = this._livros.length ? Math.max(...this._livros.map(l => l.id)) + 1 : 1;
    this._livros.push({ id: novoId, titulo, autor, ano, quantidade, disponiveis: quantidade, categoria, preco });
    console.log("Livro '" + titulo + "' adicionado com sucesso!");
  }

//Encapsulamento | Setter validado
  public cadastrarUsuario(nome: string, cpf: string, tipo: string, telefone: string) {
    if (!nome || !cpf || !tipo || !telefone) {
      console.log("ERRO: Dados inválidos para cadastrar usuário."); return;
    }
    const novoId = this._usuarios.length ? Math.max(...this._usuarios.map(u => u.id)) + 1 : 1;
    this._usuarios.push({ id: novoId, nome, cpf, tipo, ativo: true, multas: 0, telefone });
    console.log("Usuário '" + nome + "' cadastrado com sucesso!");
  }

 //Coesão busca + apresentação
  public buscarLivros(termo: string) {
    console.log("\n=== RESULTADOS DA BUSCA: '" + termo + "' ===");
    const termoMin = (termo || "").toLowerCase();
    const lista = this._livros.filter(l =>
      l.titulo.toLowerCase().includes(termoMin) || l.autor.toLowerCase().includes(termoMin)
    );
    if (lista.length === 0) { console.log("Nenhum livro encontrado."); return; }
    for (const l of lista) {
      console.log("\n📚 " + l.titulo);
      console.log("   Autor: " + l.autor);
      console.log("   Ano: " + l.ano);
      console.log("   Categoria: " + l.categoria);
      console.log("   Disponíveis: " + l.disponiveis + "/" + l.quantidade);
      console.log("   Preço: R$" + l.preco);
      console.log(l.disponiveis > 0 ? "   ✅ DISPONÍVEL PARA EMPRÉSTIMO" : "   ❌ INDISPONÍVEL NO MOMENTO");
    }
    console.log("\n" + lista.length + " livro(s) encontrado(s).");
  }
}

// ==================== “Teste” ====================
// Mantive a ordem e a intenção do seu script, mas useei MÉTODOS PÚBLICOS
console.log("╔═══════════════════════════════════════════╗");
console.log("║   SISTEMA DE GERENCIAMENTO DE BIBLIOTECA  ║");
console.log("╚═══════════════════════════════════════════╝");

const biblioteca = new BibliotecaManager();

console.log("\n--- TESTE 1: Empréstimo Normal ---");
biblioteca.realizarEmprestimo(1, 1, 10, "normal");

console.log("\n--- TESTE 2: Empréstimo para Professor ---");
biblioteca.realizarEmprestimo(2, 2, 20, "normal");

console.log("\n--- TESTE 3: Tentativa de empréstimo com multa pendente ---");
biblioteca.realizarEmprestimo(2, 3, 5, "normal");

console.log("\n--- TESTE 4: Buscar livros ---");
biblioteca.buscarLivros("code");

console.log("\n--- TESTE 5: Devolução ---");
biblioteca.realizarDevolucao(1);

console.log("\n--- TESTE 6: Adicionar novos livro ---");
// antes você dava push direto; agora usa o método público (Encapsulamento)
biblioteca.adicionarLivro("Design Patterns", "Gang of Four", 1994, 2, "tecnologia", 120.00);

console.log("\n--- TESTE 7: Cadastrar novo usuário ---");
biblioteca.cadastrarUsuario("Diego Souza", "55566677788", "estudante", "48966666666");

biblioteca.gerarRelatorioCompleto();
