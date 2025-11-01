//Classe Abstrata Funcionario, que servira para herança em outras classes de funcionários.

abstract class Funcionario {
    //Atributos privados podem ser acessados apenas dentro da própria classe.
    //Atributos encapsulados.
    private nome: string
    private salario: number
    private identificacao: string
    //Construtor para inicializar os atributos da classe Funcionario.
    constructor(
        nome: string, 
        salario: number, 
        identificacao: string) 
        {
        this.nome = nome
        this.salario = salario
        this.identificacao = identificacao;
    }
    //Métodos Getters para acessar os atributos privados acima.
    getNome(): string {
        return this.nome;
    }
    getSalario(): number {
        return this.salario;
    }
    getIdentificacao(): string {
        return this.identificacao;
    }
    mostrarDetalhes(): void {
        console.log(`Nome: ${this.nome}, Salário: ${this.salario}, Identificação: ${this.identificacao}`);
    }
    //Método abstrato de calcular salário
    //que obrigará as classes filhas a implemntar 
    //seu próprio cálculo de salário.
    abstract calcularSalario(): number;
}

/*
-----------CLASSES DERIVADAS ---------------- 
*/
//Gerente herda de Funcionario
class Gerente extends Funcionario {
    private bonus: number;

    constructor(
        nome: string, 
        salario: number, 
        identificacao: string,
        bonus: number) 
        {
        super(nome, salario, identificacao);
        this.bonus = bonus;
    }
    //Ganha salário + bônus fixo
    calcularSalario(): number {
        return this.getSalario() + this.bonus;
    }
}
//Desenvolvedor herda de Funcionario
class Desenvolvedor extends Funcionario {
    private adicionalPorProjeto: number;

    constructor(
        nome: string, 
        salario: number, 
        identificacao: string,
        adicionalPorProjeto: number) 
        {
        super(nome, salario, identificacao);
        this.adicionalPorProjeto = adicionalPorProjeto;
    }
    //Ganha salário + adicional por projeto
    calcularSalario(): number {
        return this.getSalario() + this.adicionalPorProjeto;
    }
}

