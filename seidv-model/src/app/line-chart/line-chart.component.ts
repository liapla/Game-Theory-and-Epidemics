import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart}  from 'chart.js';
import { registerables } from 'chart.js'
import { Options } from '@angular-slider/ngx-slider';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements AfterViewInit {
  @ViewChild('lineCanvas') lineCanvas!: ElementRef;
  @ViewChild('lineCanvas2') lineCanvas2!: ElementRef;
  lineChart: any;
  lineChart2: any;

  public text = 'The SEIDV model using smallpox as an example';

  public selected = "smallpox";

  public set r0(val:number){
    this._r0 = val;
    this.beta = this._gamma*this._r0
  }
  public get r0(){
    return this._r0;
  }
  private _r0: any = 5; 
  public set sigma(val:number){
    this._sigma = 1/val;
  }
  public get sigma(){
    return 1/this._sigma;
  }
  private _sigma: any = 1/11;

  public set gamma(val:number){
    this._gamma = 1/val;
    this.beta = this._gamma*this._r0
  }
  public get gamma(){
    return 1/this._gamma;
  }
  private _gamma: any = 1/3; //mean infectious response time
  
  public t_res: any = 14; //vaccinator response time
  public nu: any = 0.10; //vaccination rate
  public d_v: any = Math.pow(10,-6); //probability of death from vaccine
  public d_s: any = 0.3; //probabilty of death from smallpox
  public r: any = 0.01; //attack risk
  public alpha: any = 5000/290000000; //attack size
  public p: any = 0.1; //population that is vaccinated
  


  public beta: any = this._gamma*this._r0; //mean transmission rate
  public n: any = 1; //population

  public model: any = this.epidemiology_model(this.p);

  public dataArrayS: any[] = [];
  public dataArrayE: any[] = [];
  public dataArrayI: any[] = [];
  public dataArrayD: any[] = [];
  public dataArrayV: any[] = [];
  public dataArrayX: any[] = [];

  value: number = this.d_v;
  options: Options = {
    floor: 0.000001,
    ceil: 0.02,
    step: 0.000001,
    logScale: true,
    showTicks: false,
    showTicksValues: false
  };

  public e_vac: any = - this.d_v;
  public e_del: any = - this.r*(this.Phi_s(this.p)* this.d_s + (1 - this.Phi_s(this.p)) * this.d_v);

  constructor() { }

  ngOnInit(): void {
    Chart.register(...registerables); 
    this.createDataArrays();
  }

  ngAfterViewInit(): void {
    this.lineChartMethod();
    this.e_del = - this.r*(this.Phi_s(this.p)* this.d_s + (1 - this.Phi_s(this.p)) * this.d_v);
  }

  /*
    Method for the SEIDV Model
  */
  public seidv(t: any, state: any) {
    var D, E, I, S, V, dDdt, dEdt, dIdt, dSdt, dVdt;
    [S, E, I, D, V] = state;
    dSdt = -this.beta * S * I - this.f(S, t);
    dEdt = this.beta * S * I - E * this._sigma;
    dIdt = this._sigma * E - this._gamma * I;
    dDdt = this._gamma * I;
    dVdt = this.f(S, t);
    return [dSdt, dEdt, dIdt, dDdt, dVdt];
  }
  
  public f(S: any, t: any) {
    if (t < this.t_res) {
      return 0;
    } else {
      if (S > 0.1) {
        return this.nu;
      } else {
        return 0;
      }
    }
  }

   /*
    Method for the Eulers Method
  */
  public eulersMethod(f: any, t1: any, y1: any, t2: any, h: any) {
    var t=t1, y=y1;
    const result: any[] = []; 
  
    while (t<t2-h) {
      y = f(t, y).map((v: any, i: any) => v * h + y[i])
      t += h;
      result.push(y);
    }
    return result;
  }
  
  public rungeKutta(f: any, t1: any, y1: any, t2: any, h: any){
    var t=t1, y=y1;
    const result: any[] = []; 
  
    //y_n+1 = y_n + h* (1/6 k_1+ 4/6 k_2 + 1/6 k_3)
    while (t<t2-h) {
      const k_1 = f(t,y)
      const k_2 = f(t+h/2,y.map((val:number,i:number)=>{return val+h/2*k_1[i]}))
      const k_3 = f(t+h,y.map((val:number,i:number)=>{return val-h*k_1[i]+2*h*k_2[i]}))

      y = y.map((val:number,i:number) =>{return val + h * (1/6 * k_1[i] + 4/6*k_2[i] + 1/6 * k_3[i])})
      t += h;
      result.push(y);
    }
    return result;
  }

  public epidemiology_model(p0: any) {
    var D0, E0, I0, S0, V0, init, solution;
    S0 = 1 - p0 - (1 - p0) * this.alpha / this.n;
    E0 = (1 - p0) * this.alpha / this.n;
    I0 = 0;
    D0 = 0;
    V0 = p0;
    init = [S0, E0, I0, D0, V0];
    solution = this.rungeKutta(this.seidv.bind(this), 0, init, 100, 0.5);
    return solution;
  }

  public Phi_s(p: number):number{
    var t_max = 100;
    const num_recovered_end = this.dataArrayD[t_max];
    const not_vaccinated_start = 1 - this.dataArrayV[0];
    return num_recovered_end/not_vaccinated_start;
  }

  formatLabel(value: number) {
    if (value <= 10) {
      return value.toFixed(2);
    }
    return value;
  }

  updateChart() {
    this.model = this.epidemiology_model(this.p);
    this.createDataArrays();
    this.lineChart.options.plugins.title.text = this.text;
    this.lineChart.config.data.datasets[0].data = this.dataArrayS;
    this.lineChart.config.data.datasets[1].data = this.dataArrayE;
    this.lineChart.config.data.datasets[2].data = this.dataArrayI;
    this.lineChart.config.data.datasets[3].data = this.dataArrayD;
    this.lineChart.config.data.datasets[4].data = this.dataArrayV;
    this.lineChart.update();
    this.lineChart2.config.data.datasets[0].data = this.dataArrayE;
    this.lineChart2.config.data.datasets[1].data = this.dataArrayI;
    this.lineChart2.update();
    this.e_vac = - this.d_v;
    this.e_del = - this.r*(this.Phi_s(this.p)* this.d_s + (1 - this.Phi_s(this.p)) * this.d_v);
  }

  public resetValues() {
    this.text = 'The SEIDV model using smallpox as an example';
    this.p = 0.1; 
    this._r0 = 5;
    this._sigma = 1/11;
    this._gamma = 1/3; //mean infectious response time
    this.t_res = 14; //vaccinator response time
    this.nu = 0.10; //vaccination rate
    this.d_v = Math.pow(10,-6); //probability of death from vaccine
    this.d_s = 0.3; //probabilty of death from smallpox
    this.r= 0.01; //attack risk
    this.alpha = 5000/290000000; //attack size
    this.beta = this._gamma*this._r0; //mean transmission rate
    this.n = 1; //population
    this.updateChart();
    this.selected = "smallpox"
  }

  public covidValues() {
    this.text = 'The SEIDV model using covid-19 as an example';
    this.p = 0; //population that is vaccinated
    this._r0 = 2; //reproduction rate
    this._sigma = 1/3; //mean latent period
    this._gamma = 1/7; //mean infectious period
    this.t_res = 0; //vaccinator response time
    this.nu = Math.pow(1,-4); //vaccination rate
    this.d_v = Math.pow(10,-6); //probability of death from vaccine
    this.d_s = 0.0083; //probabilty of death from covid
    this.r= 1; //attack risk
    this.alpha = 200000/83200000; //attack size
    this.beta = this._gamma*this._r0; //mean transmission rate
    this.n = 1; //population
    this.updateChart();
    this.selected = "covid"
  }

  public createDataArrays() {
    
    for (let i = 0; i < this.model.length ; i++) {
      this.dataArrayS[i]= this.model[i][0]; 
      this.dataArrayE[i]= this.model[i][1];
      this.dataArrayI[i]= this.model[i][2];
      this.dataArrayD[i]= this.model[i][3];
      this.dataArrayV[i]= this.model[i][4];
      this.dataArrayX[i]= i*0.5;
    }
  }

  lineChartMethod() {

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.dataArrayX,
        datasets: [
          {
           label: 'S',
           fill: false,
           backgroundColor: '#85c0f9',
           borderColor: '#85c0f9',
           borderCapStyle: 'butt',
           borderDash: [],
           borderDashOffset: 0.0,
           borderJoinStyle: 'miter',
           pointBorderWidth: 0,
           pointHoverRadius: 5,
           pointHoverBackgroundColor: 'rgba(75,192,192,1)',
           pointHoverBorderColor: 'rgba(220,220,220,1)',
           pointHoverBorderWidth: 2,
           pointRadius: 1,
           pointHitRadius: 10,
           data: this.dataArrayS,
           spanGaps: false,
         },
           {
             label: 'E',
            fill: false,
            backgroundColor: '#f5793a',
            borderColor: '#f5793a',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderWidth: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.dataArrayE,
            spanGaps: false,
          },
          {
            label: 'I',
            fill: false,
            backgroundColor: '#a95aa1',
            borderColor: '#a95aa1',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderWidth: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.dataArrayI,
            spanGaps: false,
          },
          {
            label: 'D',
            fill: false,
            backgroundColor: '#ee442f',
            borderColor: '#ee442f',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderWidth: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.dataArrayD,
            spanGaps: false, 
          },
          {
            label: 'V',
            fill: false,
            backgroundColor: '#0f2080',
            borderColor: '#0f2080',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderWidth: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.dataArrayV,
            spanGaps: false,
          }

        ]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: this.text,
            padding: {
              top: 10,
              bottom: 30
            },
            font: {
              size: 20,
              family: "Roboto, 'Helvetica Neue', sans-serif"
            }
          },
          tooltip: {
            enabled: true
          },
        },
        parsing: {
          xAxisKey: 'x',
          yAxisKey: 'y'
        },
        scales: {
          y: {
            suggestedMin: 0,
            
            title: {
              display: true,
              text: 'Population',
              font: {
                  size: 16,
                  family: "Roboto, 'Helvetica Neue', sans-serif"
                }
            },
            ticks: {
              font: {
                size: 14,
                family: "Roboto, 'Helvetica Neue', sans-serif"
              }
            }
          },
          x: {
            min: 0,
            max: 100,
            type: 'linear',
            title: {
              display: true,
              text: 'Time(day)',
              font: {
                size: 16,
                family: "Roboto, 'Helvetica Neue', sans-serif"
              }
            },
            ticks: {
              stepSize:10,
              font: {
                size: 14,
                family: "Roboto, 'Helvetica Neue', sans-serif"
              },
            }
          },
        }
      } 
    });

    this.lineChart2 = new Chart(this.lineCanvas2.nativeElement, {
      type: 'line',
      data: {
        labels: this.dataArrayX,
        datasets: [
           {
            label: 'E',
            fill: false,
            backgroundColor: '#f5793a',
            borderColor: '#f5793a',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderWidth: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.dataArrayE,
            spanGaps: false,
          },
          {
            label: 'I',
            fill: false,
            backgroundColor: '#a95aa1',
            borderColor: '#a95aa1',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderWidth: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.dataArrayI,
            spanGaps: false,
          }

        ]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Display of the E and I values',
            padding: {
              top: 10,
              bottom: 30
            },
            font: {
              size: 20,
              family: "Roboto, 'Helvetica Neue', sans-serif"
            }
          },
          tooltip: {
            enabled: true
          },
        },
        parsing: {
          xAxisKey: 'x',
          yAxisKey: 'y'
        },
        scales: {
          y: {
            suggestedMin: 0,
            
            title: {
              display: true,
              text: 'Population',
              font: {
                  size: 16,
                  family: "Roboto, 'Helvetica Neue', sans-serif"
                }
            },
            ticks: {
              font: {
                size: 14,
                family: "Roboto, 'Helvetica Neue', sans-serif"
              }
            }
          },
          x: {
            min: 0,
            max: 100,
            type: 'linear',
            title: {
              display: true,
              text: 'Time(day)',
              font: {
                size: 16,
                family: "Roboto, 'Helvetica Neue', sans-serif"
              }
            },
            ticks: {
              stepSize:10,
              font: {
                size: 14,
                family: "Roboto, 'Helvetica Neue', sans-serif"
              },
            }
          },
        }
      } 
    });
  }
}
