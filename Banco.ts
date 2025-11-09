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

interface MeioPagamento{
    processarPagamento(valor: number): void;
}
//Implementação da Interface
//Métodos utilizados abaixo
//Encapsulamento usando Private nos atributos
//Polimorfismo -> Varias classes com o mesmo método
//Mas com comportamentos diferentes
class CartãoCredito implements MeioPagamento{
    private limiteDisponivel: number;

    constructor(limiteInicial: number){
        if (limiteInicial <= 0){
            throw new Error ("O limite inicial do cartão de crédito deve ser maior que zero.");
            }
            this.limiteDisponivel = limiteInicial;
        }
        //validações para valores e limites 
    public processarPagamento(valor: number): void {
        if (valor <=0){
            throw new Error("Valor inválido para pagamento com cartão de crédito.");
        }
        if (valor > this.limiteDisponivel) {
            throw new Error("Limite insuficiente no cartão de crédito.");
        }
        this.limiteDisponivel -= valor;
        console.log(`Pagamento de R$ ${valor.toFixed(2)} realizado com Cartão de Crédito.`);
        }

    public consultarLimite(): number {
    return this.limiteDisponivel;
  }
}
class CartaoDebito implements MeioPagamento {
  private saldoConta: number;

  constructor(saldoInicial: number) {
    if (saldoInicial < 0) {
      throw new Error("O saldo inicial não pode ser negativo.");
    }
    this.saldoConta = saldoInicial;
  }
  //Validação para valores e Saldo
  public processarPagamento(valor: number): void {
    if (valor <= 0) {
      throw new Error("Valor inválido para pagamento com cartão de débito.");
    }

    if (valor > this.saldoConta) {
      throw new Error("Saldo insuficiente para realizar o pagamento.");
    }

    this.saldoConta -= valor;
    console.log(`Pagamento de R$ ${valor.toFixed(2)} realizado com Cartão de Débito.`);
  }

  public consultarSaldo(): number {
    return this.saldoConta;
  }
}
class BoletoBancario implements MeioPagamento {
  private codigoBarras: string | null = null;
  private pago: boolean = false;

  public processarPagamento(valor: number): void {
    if (valor <= 0) {
      throw new Error("Valor inválido para geração de boleto.");
    }

    // Simula geração de código de barras
    this.codigoBarras = "34191." + Math.floor(Math.random() * 99999999999);
    this.pago = false;

    console.log(`Boleto gerado no valor de R$ ${valor.toFixed(2)}.`);
    console.log(`Código de barras: ${this.codigoBarras}`);
  }

  public confirmarPagamento(): void {
    if (!this.codigoBarras) {
      throw new Error("Nenhum boleto foi gerado para pagamento.");
    }

    if (this.pago) {
      throw new Error("Este boleto já foi pago anteriormente.");
    }

    this.pago = true;
    console.log("Pagamento do boleto confirmado com sucesso!");
  }

  public verificarStatus(): string {
    return this.pago ? "Pago" : "Pendente";
  }
}

