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

  // Problema 5: Outro método gigante
  public realizarDevolucao(emprestimoId: number) {
    console.log("\n=== PROCESSANDO DEVOLUÇÃO ===");
    
    // Buscar empréstimo
    var emprestimo = null;
    for (var i = 0; i < this.emprestimos.length; i++) {
      if (this.emprestimos[i].id == emprestimoId) {
        emprestimo = this.emprestimos[i];
        break;
      }
    }
    
    if (emprestimo == null) {
      console.log("ERRO: Empréstimo não encontrado!");
      return;
    }
    
    if (emprestimo.devolvido == true) {
      console.log("ERRO: Este livro já foi devolvido!");
      return;
    }
    
    // Buscar usuário
    var usuario = null;
    for (var i = 0; i < this.usuarios.length; i++) {
      if (this.usuarios[i].id == emprestimo.usuarioId) {
        usuario = this.usuarios[i];
        break;
      }
    }
    
    // Buscar livro
    var livro = null;
    for (var i = 0; i < this.livros.length; i++) {
      if (this.livros[i].id == emprestimo.livroId) {
        livro = this.livros[i];
        break;
      }
    }
    
    // Calcular multa por atraso
    var dataAtual = new Date();
    var dataDevolucao = new Date(emprestimo.dataDevolucao);
    var diasAtraso = 0;
    var multa = 0;
    
    if (dataAtual > dataDevolucao) {
      diasAtraso = Math.floor((dataAtual.getTime() - dataDevolucao.getTime()) / (1000 * 60 * 60 * 24));
      multa = diasAtraso * emprestimo.taxaMultaDiaria;
      console.log("ATENÇÃO: Devolução com " + diasAtraso + " dia(s) de atraso!");
      console.log("Multa calculada: R$" + multa.toFixed(2));
      
      usuario.multas = usuario.multas + multa;
      
      // Enviar notificação de multa
      console.log("Enviando notificação de multa...");
      console.log("Email: Multa de R$" + multa.toFixed(2) + " aplicada");
      console.log("SMS: Você possui multa pendente");
    } else {
      console.log("Devolução dentro do prazo. Sem multas!");
    }
    
    // Atualizar empréstimo
    emprestimo.devolvido = true;
    emprestimo.dataDevolucaoReal = dataAtual;
    emprestimo.multa = multa;
    
    // Atualizar disponibilidade do livro
    livro.disponiveis = livro.disponiveis + 1;
    
    // Verificar se há reservas para este livro
    console.log("Verificando reservas...");
    for (var i = 0; i < this.reservas.length; i++) {
      if (this.reservas[i].livroId == livro.id && this.reservas[i].ativo == true) {
        console.log("Há reservas pendentes para este livro!");
        console.log("Notificando usuário da reserva...");
        // Buscar usuário da reserva
        for (var j = 0; j < this.usuarios.length; j++) {
          if (this.usuarios[j].id == this.reservas[i].usuarioId) {
            console.log("Email para " + this.usuarios[j].nome + ": Livro '" + livro.titulo + "' está disponível!");
            break;
          }
        }
      }
    }
    
    console.log("\n╔════════════════════════════════════╗");
    console.log("║     COMPROVANTE DE DEVOLUÇÃO       ║");
    console.log("╠════════════════════════════════════╣");
    console.log("║ Usuário: " + usuario.nome);
    console.log("║ Livro: " + livro.titulo);
    console.log("║ Data Devolução: " + dataAtual.toLocaleDateString());
    console.log("║ Dias de Atraso: " + diasAtraso);
    console.log("║ Multa: R$" + multa.toFixed(2));
    console.log("║ Total de multas pendentes: R$" + usuario.multas.toFixed(2));
    console.log("╚════════════════════════════════════╝\n");
  }
  
  // Problema 6: Método que faz múltiplas coisas
  public gerarRelatorioCompleto() {
    console.log("\n╔═══════════════════════════════════════════════════════╗");
    console.log("║           RELATÓRIO COMPLETO DA BIBLIOTECA            ║");
    console.log("╚═══════════════════════════════════════════════════════╝\n");
    
    // Estatísticas de livros
    console.log("--- ACERVO DE LIVROS ---");
    var totalLivros = 0;
    var livrosDisponiveis = 0;
    var valorTotal = 0;
    
    for (var i = 0; i < this.livros.length; i++) {
      totalLivros = totalLivros + this.livros[i].quantidade;
      livrosDisponiveis = livrosDisponiveis + this.livros[i].disponiveis;
      valorTotal = valorTotal + (this.livros[i].preco * this.livros[i].quantidade);
      
      console.log("• " + this.livros[i].titulo + " - " + this.livros[i].autor);
      console.log("  Disponíveis: " + this.livros[i].disponiveis + "/" + this.livros[i].quantidade);
      console.log("  Categoria: " + this.livros[i].categoria + " | Valor: R$" + this.livros[i].preco);
    }
    
    console.log("\nTotal de exemplares: " + totalLivros);
    console.log("Disponíveis: " + livrosDisponiveis);
    console.log("Emprestados: " + (totalLivros - livrosDisponiveis));
    console.log("Valor total do acervo: R$" + valorTotal.toFixed(2));
    
    // Estatísticas de usuários
    console.log("\n--- USUÁRIOS ---");
    var usuariosAtivos = 0;
    var totalMultas = 0;
    
    for (var i = 0; i < this.usuarios.length; i++) {
      if (this.usuarios[i].ativo) usuariosAtivos++;
      totalMultas = totalMultas + this.usuarios[i].multas;
      
      console.log("• " + this.usuarios[i].nome + " (" + this.usuarios[i].tipo + ")");
      console.log("  Status: " + (this.usuarios[i].ativo ? "Ativo" : "Inativo"));
      console.log("  Multas: R$" + this.usuarios[i].multas.toFixed(2));
    }
    
    console.log("\nTotal de usuários: " + this.usuarios.length);
    console.log("Usuários ativos: " + usuariosAtivos);
    console.log("Total em multas: R$" + totalMultas.toFixed(2));
    
    // Estatísticas de empréstimos
    console.log("\n--- EMPRÉSTIMOS ---");
    var emprestimosAtivos = 0;
    var emprestimosAtrasados = 0;
    var dataAtual = new Date();
    
    for (var i = 0; i < this.emprestimos.length; i++) {
      if (this.emprestimos[i].devolvido == false) {
        emprestimosAtivos++;
        if (new Date(this.emprestimos[i].dataDevolucao) < dataAtual) {
          emprestimosAtrasados++;
        }
      }
    }
    
    console.log("Total de empréstimos: " + this.emprestimos.length);
    console.log("Empréstimos ativos: " + emprestimosAtivos);
    console.log("Empréstimos atrasados: " + emprestimosAtrasados);
    
    // Ranking de livros mais emprestados
    console.log("\n--- TOP 3 LIVROS MAIS EMPRESTADOS ---");
    var contagemLivros: any = {};
    for (var i = 0; i < this.emprestimos.length; i++) {
      var lid = this.emprestimos[i].livroId;
      if (contagemLivros[lid]) {
        contagemLivros[lid]++;
      } else {
        contagemLivros[lid] = 1;
      }
    }
    
    // Ordenar e mostrar top 3 (código ruim de propósito)
    // var ranking = [];
    // for (var livroId in contagemLivros) {
    //   ranking.push({ id: livroId, count: contagemLivros[livroId] });
    // }
    // ranking.sort(function(a, b) { return b.count - a.count; });
    
    // for (var i = 0; i < Math.min(3, ranking.length); i++) {
    //   for (var j = 0; j < this.livros.length; j++) {
    //     if (this.livros[j].id == ranking[i].id) {
    //       console.log((i + 1) + ". " + this.livros[j].titulo + " (" + ranking[i].count + " empréstimos)");
    //     }
    //   }
    // }

// Ordenar e mostrar top 3
var ranking = [];

for (var livroId in contagemLivros) {
  ranking.push({ id: livroId, count: contagemLivros[livroId] });
}

ranking.sort(function(a, b) {
  return b.count - a.count;
});

for (var i = 0; i < Math.min(3, ranking.length); i++) {
  const item = ranking[i];
  if (!item) continue; // se estiver undefined, pula

  for (var j = 0; j < this.livros.length; j++) {
    if (this.livros[j].id === item.id) {
      console.log(`${i + 1}. ${this.livros[j].titulo} (${item.count} empréstimos)`);
    }
  }
}

  
    
    console.log("\n" + "=".repeat(60) + "\n");
  }
  
  // Problema 7: Sem validação adequada
  public adicionarLivro(titulo: string, autor: string, ano: number, quantidade: number, categoria: string, preco: number) {
    var novoId = this.livros.length + 1;
    this.livros.push({
      id: novoId,
      titulo: titulo,
      autor: autor,
      ano: ano,
      quantidade: quantidade,
      disponiveis: quantidade,
      categoria: categoria,
      preco: preco
    });
    console.log("Livro '" + titulo + "' adicionado com sucesso!");
  }
  
  // Problema 8: Sem validação adequada
  public cadastrarUsuario(nome: string, cpf: string, tipo: string, telefone: string) {
    var novoId = this.usuarios.length + 1;
    this.usuarios.push({
      id: novoId,
      nome: nome,
      cpf: cpf,
      tipo: tipo,
      ativo: true,
      multas: 0,
      telefone: telefone
    });
    console.log("Usuário '" + nome + "' cadastrado com sucesso!");
  }
  
  // Problema 9: Método que mistura consulta com formatação
  public buscarLivros(termo: string) {
    console.log("\n=== RESULTADOS DA BUSCA: '" + termo + "' ===");
    var encontrados = 0;
    
    for (var i = 0; i < this.livros.length; i++) {
      if (this.livros[i].titulo.toLowerCase().includes(termo.toLowerCase()) || 
      this.livros[i].autor.toLowerCase().includes(termo.toLowerCase())) {
        encontrados++;
        console.log("\n📚 " + this.livros[i].titulo);
        console.log("   Autor: " + this.livros[i].autor);
        console.log("   Ano: " + this.livros[i].ano);
        console.log("   Categoria: " + this.livros[i].categoria);
        console.log("   Disponíveis: " + this.livros[i].disponiveis + "/" + this.livros[i].quantidade);
        console.log("   Preço: R$" + this.livros[i].preco);
        
        if (this.livros[i].disponiveis > 0) {
          console.log("   ✅ DISPONÍVEL PARA EMPRÉSTIMO");
        } else {
          console.log("   ❌ INDISPONÍVEL NO MOMENTO");
        }
      }
    }
    
    if (encontrados == 0) {
      console.log("Nenhum livro encontrado.");
    } else {
      console.log("\n" + encontrados + " livro(s) encontrado(s).");
    }
  }
}

// Problema 10: Código de teste misturado com código de produção
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
biblioteca.livros.push({ id: 5, titulo: "Design Patterns", autor: "Gang of Four", ano: 1994, quantidade: 2, disponiveis: 2, categoria: "tecnologia", preco: 120.00 });
biblioteca.adicionarLivro("Design Patterns", "Gang of Four", 1994, 2, "tecnologia", 120.00);

console.log("\n--- TESTE 7: Cadastrar novo usuário ---");
biblioteca.usuarios.push({ id: 4, nome: "Diego Souza", cpf: "55566677788", tipo: "estudante", ativo: true, multas: 0, telefone: "48966666666" });
biblioteca.cadastrarUsuario("Diego Souza", "55566677788", "estudante", "48966666666");

biblioteca.gerarRelatorioCompleto();