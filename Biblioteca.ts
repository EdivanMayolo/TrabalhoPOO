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
        // this.membroUsando = undefined!;
        console.log(`Livro Devolvido "${this.titulo} Obrigado ${this.membroUsando.nome}!!".`);
        this.membroUsando = undefined!;
    } else {
        console.log(`Nao é possivel devolver "${this.titulo}" pois não esta emprestado.`);
        }
    }
}

//Criado o objeto Membro com seus atributos e construtor
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
    public pegarLivrosEmprestados(livro: Livro): void {
        console.log(`${this.nome} está querendo pegar o livro "${livro.titulo}".`);
        livro.emprestar(this);
    }

    public devolverLivrosEmprestados(livro: Livro): void {
        console.log(`${this.nome} está querendo devolver o livro "${livro.titulo}".`);
        livro.devolver();
    }
}

/*BLOCO PARA TESTE.*/

const membro1 = new Membro("Edivan Mayolo", 12345);
const membro2 = new Membro("João Pedro", 98765);
const membro3 = new Membro("Leide Daiane", 56789);


const livro1 = new Livro("Dom Casmurro", "Machado de Assis", "Principis", 1899);
const livro2 = new Livro("Casmurro", "Assis", "Principis", 1899);
const livro3 = new Livro("Companhia das Letras", "George Orwell", "Papel" , 1949);
const livro4 = new Livro( "O mundo é uma bola de Golfe:", "Autor Desconhecido","Matrix", 1949);
//BLOCO PARA TESTE.

//Validações do devolver e do emprestar
//Teste 1
/*livro1.devolver();//MSG que não está emprestado
livro2.devolver();//MSG que não está emprestado
livro3.devolver();//MSG que não está emprestado
livro4.devolver();*///MSG que não está emprestado

//Teste 2
/*livro1.emprestar(membro1);
livro2.emprestar(membro2);
livro3.emprestar(membro2);
livro4.emprestar(membro2);
livro1.emprestar(membro1);*/

//Teste 3
/*livro1.emprestar(membro2);//João Pedro pega Dom Casmurro
livro1.emprestar(membro3) //já está emprestado
livro4.emprestar(membro2);//João Pedro pega O mundo é uma bola de Golfe:
livro1.devolver();//faz a devolução
livro1.devolver();*///MSG que não está emprestado

//Teste 4
/*livro4.emprestar(membro2)
livro4.devolver();
livro4.emprestar(membro1);
livro4.devolver();
livro4.emprestar(membro3);
livro4.emprestar(membro2);//MSG que já está emprestado
livro4.emprestar(membro3);//MSG que já está emprestado
console.log(membro3)
console.log(membro1)
console.log(membro2)*/

//Teste 5
/*livro3.devolver();//MSG que não está emprestado
livro3.emprestar(membro2);//Edivan Mayolo pega Companhia das Letras
livro3.emprestar(membro3);//MSG que já está emprestado
livro2.devolver();//MSG que não está emprestado
livro3.emprestar(membro3);//MSG que já está emprestado
console.log(membro2)
console.log(membro3)*/
//membro1.pegarLivrosEmprestados(livro1);
membro1.devolverLivrosEmprestados(livro2);

