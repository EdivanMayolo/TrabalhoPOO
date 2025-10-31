class Livro{
    titulo : string;
    autor : string;
    editora : string;
    anoPublicacao : number;
    disonibilidade : boolean;
    /*Bloco de declaração do molde/receita
    enquanto os atribitos são os ingredientes do molde/receita    
    */

    constructor (
        titulo : string,
        autor : string,
        editora : string,
        anoPublicacao : number,
        disonibilidade : boolean
    )
    /* O onstrutor criado é método especial chamado automaticamente quando se usarmos new Livro(...) por exemplo e serve para inicializar os atributos do objeto acima
    */
    {
       this.titulo = titulo;
       this.autor = autor;
       this.editora = editora;
       this.anoPublicacao = anoPublicacao;
       this.disonibilidade = disonibilidade; 
    }/*
    this.atributo refere-se ao atributo do objeto que está sendo criado
    atributo refere-se ao parâmetro passado para o construtor
    */
}
const livro1 = new Livro("Dom Casmurro", "Machado de Assis", "Principis", 1899, true);
console.log(livro1);
//console.log(***********)
const livro2 = new Livro("1984", "George Orwell", "Companhia das Letras", 1949, false);
console.log(livro2.titulo); 
console.log(livro2.autor);
console.log(livro2.disonibilidade); 
/*
BLOCO PARA TESTE.
*/