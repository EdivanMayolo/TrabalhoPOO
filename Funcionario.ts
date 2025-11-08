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
        // return this.getSalario() + this.bonus;
        return this.getSalario() + (this.getSalario() * 0.20);
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
        // add bunus para cada projeto, com 10% em cima do salario base 
        //para cada projeto
        const bonus = this.getSalario() * 0.10 * this.adicionalPorProjeto;
        return this.getSalario() + bonus;
    }
}

class Estagiario extends Funcionario {

    constructor(
        nome: string, 
        salario: number, 
        identificacao: string) 
        {
        super(nome, salario, identificacao);
    }
    //Ganha apenas o salário base
    calcularSalario(): number {
        return this.getSalario();
    }
}
//Cada instância chama seu respectivo construtor, passando os parâmetros exigidos
//Gerente, Desenvolvedor e Estagiário são todos do tipo Funcionario
//Usando polimorfismo dentro do array
const funcionarios: Funcionario[] = [
    new Gerente("Leide", 8000, "Ger1", 1500),
    new Desenvolvedor("Edivan", 5000, "Dev1", 1),
    new Estagiario("João Pedro", 2000, "Est1")
];


// console.log(`Nome: ${funcionarios.getNome()} | Salário Calculado: R$ ${funcionarios.calcularSalario().toFixed(2)}`);

// for (const funcionario of funcionarios) {
//     console.log(`Nome: ${funcionario.getNome()},Cargo: ${funcionario.getIdentificacao()}, Salário Calculado: R$ ${funcionario.calcularSalario().toFixed(2)}`);
//     //console.log(`Identificação: ${funcionario.getIdentificacao()}`);
// }
for (const funcionario of funcionarios) {
    console.log("--------------------------------------------------");
    console.log(`Cargo: ${funcionario.constructor.name}`);
    console.log(`Nome: ${funcionario.getNome()}`);
    console.log(`Identificação: ${funcionario.getIdentificacao()}`);
    console.log(`Salário base: R$ ${funcionario.getSalario().toFixed(2)}`);
    console.log(`Salário calculado (polimórfico): R$ ${funcionario.calcularSalario().toFixed(2)}`);
}
console.log("--------------------------------------------------");

