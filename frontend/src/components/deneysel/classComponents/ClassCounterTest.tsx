// Counter.tsx
import React from "react";

interface CounterProps {
  initialCount?: number;      // opsiyonel başlangıç sayısı
  label?: string;             // buton yanında gösterilecek başlık
}

interface CounterState {
  count: number;
  loading: boolean
  error?: string|null
}

export default class ClassCounterTest extends React.Component<CounterProps, CounterState> {
  // typed ref
  private inputRef: React.RefObject<HTMLInputElement>;

  constructor(props: CounterProps) {
    super(props);
    this.state = {
      count: props.initialCount ?? 0,
      loading: false,
      error: null
    };

    this.inputRef = React.createRef<HTMLInputElement>();

    // Eğer arrow fonksiyon kullanılmasaydı, bind edilmesi gerekirdi:
    // this.handleIncrement = this.handleIncrement.bind(this);
  }

  // component mount olduktan sonra çalışır
  async componentDidMount() {

    try {
      const fetchedX = await 
      fetch('https://jsonplaceholder.typicode.com/todos/2')
      .then(response => {
        console.log('düz fetch response:',response)
        console.log('düz fetch response.ok:',response.ok)
        if(!response.ok){
          // throw Error ( 'status code:' + response.status.toString())
          this.setState({error:'fetch patladı'})
        }
        return(
          response.json()
        )
      })
      console.log('fetched dalga:', fetchedX.id)
      this.setState({ count: fetchedX.id })
    } catch (error) {
      // throw Error ('fetch hata:', error as Error)
    }
    

    // örnek: input'a focus
    this.inputRef.current?.focus();

    // örnek: veri çekme simülasyonu
    this.setState({ loading: true });
    setTimeout(() => {
      // veri geldikten sonra loading false yapıyoruz
      this.setState({ loading: false });
    }, 600)

    
  }

  // performans optimizasyonu için kullanılabilir
  shouldComponentUpdate(nextProps: CounterProps, nextState: CounterState) {
    // basit örnek: yalnızca count değiştiyse güncelle
    return nextState.count !== this.state.count || nextState.loading !== this.state.loading;
  }

  componentDidUpdate(prevProps: CounterProps, prevState: CounterState) {
    if (prevState.count !== this.state.count) {
      console.log("Count değişti:", this.state.count);
    }
  }

  componentWillUnmount() {
    // temizleme yapılacaksa burada
    console.log("Counter unmount oluyor.");
  }

  // alttaki örnekteki gibi Arrow function olmasaydı, constructor  içinde this.handleIncrement = this.handleIncrement.bind(this) şeklinde tanımlamak gerekirdi, yukarda örneği var
  // handleIncrement() {
  //   this.setState((prev) => ({ count: prev.count + 1 }));
  // }
  // class property arrow function -> this otomatik bağlanır
  handleIncrement = () => {
    // setState fonksiyonuyla prevState kullanımı (güvenli)
    this.setState((prev) => ({ count: prev.count + 1 }));
  };

  handleDecrement = () => {
    this.setState((prev) => ({ count: prev.count - 1 }));
  };

  handleReset = () => {
    this.setState({ count: this.props.initialCount ?? 0 });
  };

  render() {
    const { label = "Sayaç" } = this.props
    const { count, loading, error } = this.state

    if (count === 8) {
      throw Error("Sayı 8 olduğu için hata fırlatıldı!")
    }
    
    if(error){
      throw Error("fetch hatası")
    }

  // if(this.state.count<8){
  //   this.setState((prev)=> {
  //     return(
  //       {count: prev.count+3}
  //     )
  //   })
  // }

  // setTimeout(() => {
  //     this.setState((prev)=> {
  //       return(
  //         {count: prev.count+3}
  //       )
  //     })
  //   }, 600)


    return (
      <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, width: 260 }}>
        <h3>{label}</h3>
        <div>
          <input ref={this.inputRef} aria-label="counter-input" value={count} readOnly style={{ width: 60, textAlign: "center" }} />
        </div>

        <div style={{ marginTop: 8 }}>
          <button onClick={this.handleIncrement}>+</button>
          <button onClick={this.handleDecrement} style={{ marginLeft: 6 }}>-</button>
          <button onClick={this.handleReset} style={{ marginLeft: 6 }}>Reset</button>
        </div>

        <div style={{ marginTop: 8 }}>
          {loading ? <small>Yükleniyor...</small> : <small>Hazır</small>}
        </div>
      </div>
    );
  }
}