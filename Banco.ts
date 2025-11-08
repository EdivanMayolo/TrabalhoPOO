//Classe usando Encapsulamento
class ContaBanco{
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
    public Saldo(): number {
        return this.saldo;
    }

    public Historico(): string[] {
        return this.historico;
    }

    private NumeroConta(): number {
        return this.numeroConta;
    }
    private Titular(): string {
        return this.titular;
    }
}