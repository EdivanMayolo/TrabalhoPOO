//Classe usando Encapsulamento e Abstração
//Com atributos privados
class ContaBancaria{
    private saldo: number; 
    private historico: string[] = [];
        
    constructor(
        private titular: string, 
        private numeroConta: number,
        saldoInicial: number = 0)
        {
            this.saldo = saldoInicial;
            this.historico = [];
        }
//Métodos usando Abstração

    public transferir(valor: number): void{
        //validação para evitar valores negativos ou nulos
        if (valor<= 0){
            throw new Error("Valor deve ser maior que 0.")};

        this.saldo += valor;
        //const para capturar a data
        const data = new Date().toLocaleDateString("pt-BR")
        //Coloca uma descrição no Histórico
        this.historico.push(`[${data}]Transferencia de R$ ${valor.toFixed(2)}`); 
    }
    public Saldo(): number {
        return this.saldo;
    }

    public Historico(): string[] {
        return this.historico;
    }
    //métodos privados de Dados da conta
    private NumeroConta(): number {
        return this.numeroConta;
    }
    private Titular(): string {
        return this.titular;
    }
}