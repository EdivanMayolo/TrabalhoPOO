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
        banco: string,
        agencia : number 
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
        return [...this.historico];
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
   public setStatus(novoStatus: string): void {
    if (!["ATIVA", "BLOQUEADA", "ENCERRADA"].includes(novoStatus)) {
      throw new Error("Status inválido.");
    }
    this.status = novoStatus;
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

      public getLimiteDisponivel(): number {
        return this.limiteDisponivel;
      }
      public getBandeira(): string {
        return this.bandeira;
      }
      public getNomeTitular(): string {
        return this.nomeTitular;
      }
      public getValidade(): string {
        return this.validade;
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
    public getSaldoConta(): number {
      return this.saldoConta;
    }
    public getBanco(): string {
      return this.banco;
    }
    public getNomeTitular(): string {
      return this.nomeTitular;
    }
    public getValidade(): string {
      return this.validade;
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
  // Getters de leitura
  public getStatus(): string {
    return this.status;
  }
  public getCodigoBarras(): string | null {
    return this.codigoBarras;
  }
  public getValor(): number {
    return this.valor;
  }
  public getVencimento(): string {
    return this.vencimento;
  }
  public getNomeSacado(): string {
    return this.nomeSacado;
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
   // Getters de leitura
  public getChavePix(): string {
    return this.chavePix;
  }
  public getTipoChave(): string {
    return this.tipoChave;
  }
  public getBancoDestino(): string {
    return this.bancoDestino;
  }
  public getNomeDestinatario(): string {
    return this.nomeDestinatario;
  }
}
//Isntanciando 4 contas bancarias

//titular,número da conta,saldo inicial,banco,agencia
const conta1 = new ContaBancaria("Leide",1001,1000,"Banco do Brasil",4015);
const conta2 = new ContaBancaria("João Pedro",987417,25000,"Banco Caixa",9875)
const conta3 = new ContaBancaria("Edivan",2300,18000,"Banco Sicredi",528919);
const conta4 = new ContaBancaria("Fulano",5555,0,"Banco Seilá",1000);


// número do cartão,nome no cartão,validade,limite disponível,bandeira
//Cartão de Credito
const cartaoCreditoConta1= new CartaoCredito(
  "4111111111111111", "Leide","12/29",5000,"VISA");

// saldo disponível no débito 1200
//Cartão de Deboito
const cartaoDebitoConta2 = new CartaoDebito("555-555-555-100","João Pedro","10/28",1200,"Master");

//valor, vencimento,Sacado
const boletoParaConta3 = new BoletoBancario(350,"2025-12-15","Edivan");

// chave Pix,tipo de chave,banco destino,destinatário
const pixParaFulano = new Pix("fulano@gmail.com","EMAIL","Banco Seilá","Fulano"              // destinatário
);

// console.log(`${conta1.getTitular()} | Conta ${conta1.getNumeroConta()} | Saldo: R$ ${conta1.getSaldo().toFixed(2)}`);
// console.log(`${conta2.getTitular()} | Conta ${conta2.getNumeroConta()} | Saldo: R$ ${conta2.getSaldo().toFixed(2)}`);
// console.log(`${conta3.getTitular()} | Conta ${conta3.getNumeroConta()} | Saldo: R$ ${conta3.getSaldo().toFixed(2)}`);
// console.log(`${conta4.getTitular()} | Conta ${conta4.getNumeroConta()} | Saldo: R$ ${conta4.getSaldo().toFixed(2)}`);

// ================================================
// Passo 6 (versão enxuta): cenários + runner genérico
// ================================================

function brl(v: number) { return `R$ ${v.toFixed(2)}`; }
function nowBR() { return new Date().toLocaleString("pt-BR"); }

function executar(label: string, fn: () => void) {
  try {
    console.log(`[${nowBR()}] ${label}`);
    fn();
    console.log(`[OK] ${label}\n`);
  } catch (e: any) {
    console.error(`[ERRO] ${label} -> ${e.message}\n`);
  }
}

function imprimirHistoricoConta(conta: ContaBancaria) {
  console.log(`\n==== Histórico da Conta ${conta.getNumeroConta()} | Titular: ${conta.getTitular()} ====`);
  const hist = conta.getHistorico();
  if (!hist.length) { console.log("(sem movimentações)"); return; }
  for (const linha of hist) console.log(linha);
  console.log(`Saldo atual: ${brl(conta.getSaldo())}`);
}

// -------------------------
// Cenários de simulação
// -------------------------
const cenarios: Array<() => void> = [
  // 1) Crédito (sucesso e falha)
  () => executar(`Cartão de Crédito: pagar ${brl(300)}`, () => {
    cartaoCreditoConta1.processarPagamento(300);
    console.log(`Limite restante: ${brl(cartaoCreditoConta1.getLimiteDisponivel())}`);
  }),
  () => executar(`Cartão de Crédito: pagar ${brl(6000)} acima do limite`, () => {
    cartaoCreditoConta1.processarPagamento(6000); // deve falhar
  }),

  // 2) Débito (sucesso e falha)
  () => executar(`Cartão de Débito: pagar ${brl(200)}`, () => {
    cartaoDebitoConta2.processarPagamento(200);
    console.log(`Saldo débito restante: ${brl(cartaoDebitoConta2.getSaldoConta())}`);
  }),
  () => executar(`Cartão de Débito: pagar ${brl(2000)} sem saldo`, () => {
    cartaoDebitoConta2.processarPagamento(2000); // deve falhar
  }),

  // 3) Boleto (falha gerar, gerar ok, confirmar ok, confirmar duplicado)
  () => executar(`Boleto: gerar ${brl(0)} (inválido)`, () => {
    boletoParaConta3.processarPagamento(0); 
  }),
  () => executar(`Boleto: gerar ${brl(350)}`, () => {
    boletoParaConta3.processarPagamento(350);
  }),
  () => executar(`Boleto: confirmar pagamento`, () => {
    boletoParaConta3.confirmarPagamento();
    conta3.transferir(350);
  }),
  () => executar(`Boleto: confirmar novamente (deve falhar)`, () => {
    boletoParaConta3.confirmarPagamento();
  }),

  // 4) Pix (teste de falha e sucesso)
  () => executar(`Pix: enviar ${brl(0)} (inválido)`, () => {
    pixParaFulano.processarPagamento(0);
  }),
  () => executar(`Pix: enviar ${brl(150)} para conta4`, () => {
    pixParaFulano.processarPagamento(150);
    conta4.transferir(150);
  }),
];
console.log("\n================ INÍCIO Do TESTE================\n");
for (const cenario of cenarios) cenario();

console.log("\n================ HISTÓRICOS ================");
imprimirHistoricoConta(conta1);
imprimirHistoricoConta(conta2);
imprimirHistoricoConta(conta3); 
imprimirHistoricoConta(conta4); 
console.log("\n================ ACABOU ================\n");
