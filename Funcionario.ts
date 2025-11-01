abstract class Funcionario {
    private nome: string
    private salario: number
    private identificacao: string

    constructor(
        nome: string, 
        salario: number, 
        identificacao: string) 
        {
        this.nome = nome
        this.salario = salario
        this.identificacao = identificacao;
    }
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

    abstract calcularSalario(): number;
}