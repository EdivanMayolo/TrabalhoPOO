//Classe Membro: abstração de um membro da biblioteca,
// com atributos e construtor que inicializam o objeto.
class Livro{
    public titulo : string;
    public autor : string;
    public editora : string;
    public anoPublicacao : number;
    private disonibilidade : boolean;  

    private membroUsando!: Membro;

    /* O construtor criado é método especial chamado automaticamente quando se usarmos new Livro(...) por exemplo e serve para inicializar os atributos do objeto acima
    */
    constructor (
        titulo : string,
        autor : string,
        editora : string,
        anoPublicacao : number,
        disonibilidade : boolean = true
    )
    {
       this.titulo = titulo;
       this.autor = autor;
       this.editora = editora;
       this.anoPublicacao = anoPublicacao;
       this.disonibilidade = disonibilidade; 
    }

//Validação de disponibilidade do livro atraves de IF 
// Marca o livro como indisponível em caso de emprestimo(this.disonibilidade = false).
public emprestar(membro: Membro): void {
    const JaTemOlivro = membro.livrosEmprestados.includes(this);
    if (JaTemOlivro){
        console.log(`Você ${membro.nome} já possui esse mesmo livro "${this.titulo}".`);
    }
    if (this.disonibilidade) {
        this.disonibilidade = false;
        membro.livrosEmprestados.push(this);
        this.membroUsando = membro;
        console.log(`O livro "${this.titulo}" é seu ${membro.nome}... Até Vc Devolver.`);
    } else {
        console.log(`Livro "${this.titulo}" já está emprestado.`);
    }
  }
//Validação para devolver o livro usando IF (!this.disonibilidade)
//Marca o livro como disponível (this.disonibilidade = true).
//Remove o livro do array livrosEmprestados do membro que o tinha (filter).
public devolver(): void {
    if (!this.disonibilidade) {
        this.disonibilidade = true;
        this.membroUsando.livrosEmprestados = 
            this.membroUsando.livrosEmprestados.filter(livro => livro !== this);
        // this.membroUsando = undefined!;
        console.log(`Livro "${this.titulo}" devolvido, Obrigado "${this.membroUsando.nome}!!".`);
        this.membroUsando = undefined!;
    } else {
        console.log(`Nao é possivel devolver "${this.titulo}" pois não esta emprestado.`);
        }
    }
}

//Criado o objeto Membro com seus atributos e construtor
//Encapsulamento e abstração dos objetos Membro
class Membro{
    public nome : string;
    public identificacao : number;
    public livrosEmprestados : Livro[];

    constructor (
        nome : string,
        identificacao : number
    )
    {
       this.nome = nome;
       this.identificacao = identificacao;
       this.livrosEmprestados = []; 
    }
    //método chama Livro.emprestar e Livro decide se pode ou não emprestar(Encapsulamento)
    public pegarLivrosEmprestados(livro: Livro): void {
        console.log(`${this.nome} está querendo pegar o livro "${livro.titulo}".`);
        livro.emprestar(this);
    }
    //método
    public devolverLivrosEmprestados(livro: Livro): void {
        console.log(`${this.nome} está querendo devolver o livro "${livro.titulo}".`);
        livro.devolver();
    }
}

//Instanciando objetos Membro e Livro
//Abstração dos objetos das classes criadas acima(Membro e Livro)
const membro1 = new Membro("Edivan Mayolo", 12345);
const membro2 = new Membro("João Pedro", 98765);
const membro3 = new Membro("Leide Daiane", 56789);


const livro1 = new Livro("Dom Casmurro", "Machado de Assis", "Principis", 1899);
const livro2 = new Livro("Casmurro", "Assis", "Principis", 1899);
const livro3 = new Livro("Companhia das Letras", "George Orwell", "Papel" , 1949);
const livro4 = new Livro( "O mundo é uma bola de Golfe?", "Autor Desconhecido","Matrix", 1949);
//BLOCO PARA TESTE.
/*console.log("\n=== Objetos instanciados com sucesso ===\n");
console.log(livro1, livro2, livro3, livro4);
console.log(membro1, membro2, membro3);*/

//Validações dos métodos devolver e do emprestar
// ========================= Teste 1 =========================

// console.log("\n*** Teste 1: Devolver livros que não estão emprestados ***\n");
// livro1.devolver();//MSG que não está emprestado
// livro2.devolver();//MSG que não está emprestado
// livro3.devolver();//MSG que não está emprestado
// livro4.devolver();///MSG que não está emprestado

// ========================= Teste 2 =========================

// console.log("\n*** Teste 2: Emprestar livros disponíveis ***\n");
// livro1.emprestar(membro1);
// livro2.emprestar(membro2);
// livro3.emprestar(membro2);
// livro4.emprestar(membro2);
// livro1.emprestar(membro1);

// ========================= Teste 3 =========================
/*
console.log("\n*** Teste 3: Emprestar livros indisponíveis e devolver livros ***\n");
livro1.emprestar(membro2);//João Pedro pega Dom Casmurro
livro1.emprestar(membro3) //já está emprestado
livro4.emprestar(membro2);//João Pedro pega O mundo é uma bola de Golfe:
livro1.devolver();//faz a devolução
livro1.devolver();*///MSG que não está emprestado

// ========================= Teste 4 =========================
/*
console.log("\n*** Teste 4: Emprestar e devolver livros com várias operações ***\n");
livro4.emprestar(membro2)
livro4.devolver();
livro4.emprestar(membro1);
livro4.devolver();
livro4.emprestar(membro3);
livro4.emprestar(membro2);//MSG que já está emprestado
livro4.emprestar(membro3);//MSG que já está emprestado
console.log(membro3)
console.log(membro1)
console.log(membro2)*/

// ========================= Teste 5 =========================
/*
console.log("\n*** Teste 5: Devolver livros e tentar emprestar novamente ***\n");
livro3.devolver();//MSG que não está emprestado
livro3.emprestar(membro2);//Edivan Mayolo pega Companhia das Letras
livro3.emprestar(membro3);//MSG que já está emprestado
livro2.devolver();//MSG que não está emprestado
livro3.emprestar(membro3);//MSG que já está emprestado
console.log(membro2)
console.log(membro3)*/

// ========================= Teste 6 =========================
// console.log("\n*** Teste 7: Devolver livros e tentar emprestar novamente ***\n");
// livro1.emprestar(membro1);
// livro3.emprestar(membro1);
// livro1.emprestar(membro2);
// livro1.emprestar(membro1);
// livro1.devolver();
// livro1.emprestar(membro2);
// livro1.emprestar(membro3);
// livro2.emprestar(membro3);

// console.log({
//   Edivan: membro1.livrosEmprestados.map(l => l.titulo),
//   Joao:   membro2.livrosEmprestados.map(l => l.titulo), 
//   Leide:  membro3.livrosEmprestados.map(l => l.titulo)  
// });
// ====================== Teste 7 =========================
//Garantir que os livros estão disponíveis
// console.log("\n=== Teste  ===");
// livro1.devolver();
// livro2.devolver();
// livro3.devolver();
// livro4.devolver();

// membro1.pegarLivrosEmprestados(livro1); // deve emprestar normalmente
// membro1.pegarLivrosEmprestados(livro1); // deve avisar que já possui o livro
// console.log("Livros de Edivan:", membro1.livrosEmprestados.map(l => l.titulo));

// ====================== Teste 8 =========================
// console.log("\n=== Teste 8 ===\n");
// livro2.devolver(); //Garantir que os livros estão disponíveis//
// membro2.pegarLivrosEmprestados(livro2); // João pega
// membro3.pegarLivrosEmprestados(livro2); // Leide tenta, deve receber mensagem de indisponível
// membro2.devolverLivrosEmprestados(livro2); // João devolve
// membro3.pegarLivrosEmprestados(livro2); // Leide pega agora

// console.log({
//   Joao: membro2.livrosEmprestados.map(l => l.titulo),
//   Leide: membro3.livrosEmprestados.map(l => l.titulo)
// });
// ====================== Teste 9 =========================
// console.log("\n=== Teste 9 ===\n");
// console.log("Garantir que os livros estão disponíveis\n");
// livro1.devolver(); 
// livro3.devolver(); 
// livro4.devolver(); 
// console.log("\n");
// membro1.pegarLivrosEmprestados(livro1); // Edivan pega 1
// membro1.pegarLivrosEmprestados(livro3); // Edivan pega 3
// membro1.pegarLivrosEmprestados(livro4); // Edivan pega 4
// console.log("\n");
// console.log("Antes de Devolver:", membro1.livrosEmprestados.map(l => l.titulo));
// console.log("\n");
// membro1.devolverLivrosEmprestados(livro3); // devolve um
// membro1.devolverLivrosEmprestados(livro1); // devolve outro
// membro1.devolverLivrosEmprestados(livro4); // devolve o último
// console.log("\n");
// console.log("Depois de Devolver:", membro1.livrosEmprestados.map(l => l.titulo));

// ====================== Teste 10 =========================
 console.log("\n=== Teste 10 ===\n");

membro3.pegarLivrosEmprestados(livro4); // Leide pega
console.log("\n");
membro2.devolverLivrosEmprestados(livro3); // João tenta devolver, mas não tem
console.log("\n");
membro2.pegarLivrosEmprestados(livro4); // João tenta pegar, mas não pode
console.log("\n");
membro1.devolverLivrosEmprestados(livro2); // Edivan tenta devolver, mas não tem
console.log("\n");
membro2.pegarLivrosEmprestados(livro3); // João pega
console.log("\n");
membro3.pegarLivrosEmprestados(livro4); // Leide tenta pegar de novo   
console.log({
  Edivan: membro1.livrosEmprestados.map(l => l.titulo),
  Joao: membro2.livrosEmprestados.map(l => l.titulo),
  Leide: membro3.livrosEmprestados.map(l => l.titulo)
});