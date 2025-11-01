 /*Bloco de declaração do molde/receita
    enquanto os atribitos são os ingredientes do molde/receita    
*/
class Livro{
    titulo : string;
    autor : string;
    editora : string;
    anoPublicacao : number;
    disonibilidade : boolean;  

    /* O onstrutor criado é método especial chamado automaticamente quando se usarmos new Livro(...) por exemplo e serve para inicializar os atributos do objeto acima
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
emprestar(): void {
    if (this.disonibilidade) {
        this.disonibilidade = false;
        console.log(`O livro "${this.titulo}" é seu... Até Vc Devolver.`);
    } else {
        console.log(`Livro "${this.titulo}"já está emprestado.`);
    }
  }
//Validação para devolver o livro usando IF (!this.disonibilidade)
devolver(): void {
    if (!this.disonibilidade) {
        this.disonibilidade = true;
        console.log(`Livro Devolvido "${this.titulo}".`);
    } else {
        console.log(`Nao é possivel devolver "${this.titulo}" não estava emprestado.`);
        }
    }
}

/*
BLOCO PARA TESTE.
*/
/*const livro1 = new Livro("Dom Casmurro", "Machado de Assis", "Principis", 1899, true);
console.log(livro1);
//console.log(***********)
const livro2 = new Livro("1984", "George Orwell", "Companhia das Letras", 1949, false);
console.log(livro2.titulo); 
console.log(livro2.autor);
console.log(livro2.disonibilidade); */

const livro1 = new Livro("Dom Casmurro", "Machado de Assis", "Principis", 1899);


/*livro1.emprestar(); // Empresta com sucesso
livro1.emprestar(); // Tenta emprestar de novo (erro lógico)
livro1.devolver();  // Devolve com sucesso
livro1.devolver();  // Tenta devolver novamente (aviso)*/

class Membro{
    nome : string;
    identificacao : number;
    livrosEmprestados : Livro[];

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
const membro1 = new Membro("Edivan Mayolo", 12345);
console.log(membro1);