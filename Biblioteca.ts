 /*Bloco de declaração do molde/receita
    enquanto os atribitos são os ingredientes do molde/receita    
*/
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
    if (this.disonibilidade) {
        this.disonibilidade = false;
        membro.livrosEmprestados.push(this);
        this.membroUsando = membro;
        console.log(`O livro "${this.titulo}" é seu ${membro.nome} Até Vc Devolver.`);
    } else {
        console.log(`Livro "${this.titulo}"já está emprestado.`);
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
        this.membroUsando = undefined!;
        console.log(`Livro Devolvido "${this.titulo}".`);
    } else {
        console.log(`Nao é possivel devolver "${this.titulo}" não estava emprestado.`);
        }
    }
}
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
}

/*
BLOCO PARA TESTE.
/*const livro1 = new Livro("Dom Casmurro", "Machado de Assis", "Principis", 1899, true);
console.log(livro1);
//console.log(***********)
const livro2 = new Livro("1984", "George Orwell", "Companhia das Letras", 1949, false);
console.log(livro2.titulo); 
console.log(livro2.autor);
console.log(livro2.disonibilidade); */

/*const livro1 = new Livro("Dom Casmurro", "Machado de Assis", "Principis", 1899);
livro1.emprestar(); // Empresta com sucesso
livro1.emprestar(); // Tenta emprestar de novo (erro lógico)
livro1.devolver();  // Devolve com sucesso
livro1.devolver();  // Tenta devolver novamente (aviso)*/


//Criado o objeto Membro com seus atributos e construtor
const membro1 = new Membro("Edivan Mayolo", 12345);
const membro2 = new Membro("João Pedro", 98765);
const membro3 = new Membro("Leide Daiane", 56789);
//console.log(membro1);*/

const livro1 = new Livro("Dom Casmurro", "Machado de Assis", "Principis", 1899);
const livro2 = new Livro("Casmurro", "Assis", "Principis", 1899);
const livro3 = new Livro("1984", "George Orwell", "Companhia das Letras", 1949);
const livro4 = new Livro("2001", "Autor Desconhecido", "O mundo é uma bola de Golfe:", 1949);

//Validações do devolver e do emprestar
//Teste 1
/*livro1.devolver();
livro2.devolver();
livro3.devolver();
livro4.devolver();*/

//Teste 2
/*livro1.emprestar(membro1);
livro2.emprestar(membro2);
livro3.emprestar(membro2);
livro4.emprestar(membro2);
livro1.emprestar(membro1);*/

//Teste 3

livro4.devolver();


livro1.emprestar(membro2);
livro1.devolver();


/*livro2.emprestar(membro1);


livro1.emprestar(membro1);
// console.log(livro1)
livro1.devolver();
console.log(membro1.livrosEmprestados);
livro2.devolver()
console.log(membro1.livrosEmprestados);
// console.log(livro1)
livro1.emprestar(membro1);*/
