//Classe usando Encapsulamento
//Atributos privados
class ContaBancaria{
    private titular: string;
    private numeroConta: number;
    private saldo: number; 
    private historico: string[] = [];
    private banco: string;
    private agencia : number;
    private status : string;
        
    constructor(
        titular: string, 
        numeroConta: number,
        saldoInicial: number = 0,
        banco: string = 'Banco TAL',
        agencia : number = 1000
      )
        { 
          //Inicializa os atributos quando o método é criado
            this.titular = titular;
            this.numeroConta = numeroConta;
            this.saldo = saldoInicial;
            this.historico = [];
            this.banco = banco;
            this.agencia = agencia;
            this.status = "Ativa";
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
    public getSaldo(): number {
        return this.saldo;
    }

    public getHistorico(): string[] {
        return this.historico;
    }
    //métodos GETTERS para acessar as infos dos private( Encapsulamento)
    public getNumeroConta(): number {
        return this.numeroConta;
    }
    public getTitular(): string {
        return this.titular;
    }
    public getBanco(): string {
    return this.banco;
    }
    public getAgencia(): number {
    return this.agencia;    
    }
    public getStatus(): string {
    return this.status;
  }
}
//Abstração
//Faz a definição de um 'Contrato'
interface MeioPagamento{
    processarPagamento(valor: number): void;
}
//Implementação da Interface
//Métodos utilizados abaixo
//Polimorfismo -> Varias classes com o mesmo método
//Mas com comportamentos diferentes
class CartaoCredito implements MeioPagamento {
  private numeroCartao: string;
  private nomeTitular: string;
  private validade: string;
  private limiteDisponivel: number;
  private bandeira: string;

  constructor(numeroCartao: string, nomeTitular: string, validade: string, limiteInicial: number, bandeira: string) {
    this.numeroCartao = numeroCartao;
    this.nomeTitular = nomeTitular;
    this.validade = validade;
    this.limiteDisponivel = limiteInicial;
    this.bandeira = bandeira;
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
    console.log(`Pagamento de R$ ${valor.toFixed(2)} realizado com Cartão de Crédito (${this.bandeira}).`);
        }

    public consultarLimite(): number {
    return this.limiteDisponivel;
  }
}
class CartaoDebito implements MeioPagamento {
  private numeroCartao: string;
  private nomeTitular: string;
  private validade: string;
  private saldoConta: number;
  private banco: string;

  constructor(numeroCartao: string, nomeTitular: string, validade: string, saldoInicial: number, banco: string) {
    this.numeroCartao = numeroCartao;
    this.nomeTitular = nomeTitular;
    this.validade = validade;
    this.saldoConta = saldoInicial;
    this.banco = banco;
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
    console.log(`Pagamento de R$ ${valor.toFixed(2)} realizado com Cartão de Débito do banco ${this.banco}.`);
  }

  public consultarSaldo(): number {
    return this.saldoConta;
  }
}
class BoletoBancario implements MeioPagamento {
  private codigoBarras: string | null = null;
  private valor: number;
  private vencimento: string;
  private status: string;
  private nomeSacado: string;

  constructor(valor: number, vencimento: string, nomeSacado: string) {
    this.valor = valor;
    this.vencimento = vencimento;
    this.nomeSacado = nomeSacado;
    this.status = "PENDENTE";
  }

  public processarPagamento(valor: number): void {
    if (valor <= 0) {
      throw new Error("Valor inválido para geração do boleto.");
    }

    // Simula geração de código de barras
    this.codigoBarras = "34191." + Math.floor(Math.random() * 99999999999);
    console.log(`Boleto gerado para ${this.nomeSacado}, valor R$ ${valor.toFixed(2)} com vencimento em ${this.vencimento}.`);
    console.log(`Código de barras: ${this.codigoBarras}`);
  }

  public confirmarPagamento(): void {
    if (!this.codigoBarras) {
      throw new Error("Nenhum boleto gerado para pagamento.");
    }
    this.status = "PAGO";
    console.log("Pagamento do boleto confirmado.");
  }
}

class Pix implements MeioPagamento {
  private chavePix: string;
  private tipoChave: string;
  private bancoDestino: string;
  private nomeDestinatario: string;

  constructor(chavePix: string, tipoChave: string, bancoDestino: string, nomeDestinatario: string) {
    this.chavePix = chavePix;
    this.tipoChave = tipoChave;
    this.bancoDestino = bancoDestino;
    this.nomeDestinatario = nomeDestinatario;
  }

  public processarPagamento(valor: number): void {
    if (valor <= 0) {
      throw new Error("Valor inválido para pagamento via Pix.");
    }

    console.log(`Pagamento de R$ ${valor.toFixed(2)} enviado via Pix para 
    ${this.nomeDestinatario} (${this.tipoChave}: ${this.chavePix}) no ${this.bancoDestino}.`);
  }
}