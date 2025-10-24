class Livro{
    titulo : string;
    autor : string;
    editora : string;
    anoPublicacao : number;
    disonibilidade : boolean;

    constructor (
        titulo : string,
        autor : string,
        editora : string,
        anoPublicacao : number,
        disonibilidade : boolean
    )
    {
       this.titulo = titulo;
       this.autor = autor;
       this.editora = editora;
       this.anoPublicacao = anoPublicacao;
       this.disonibilidade = disonibilidade; 
    }
}
const livro1 = new Livro("O Senhor dos Anéis", "J.R.R. Tolkien", "HarperCollins", 1954, true);
console.log(livro1);