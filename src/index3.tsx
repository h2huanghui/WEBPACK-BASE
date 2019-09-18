import React from 'react'
import ReactDom from 'react-dom'
//ts ????
interface IProps {
    num:number
}
let initState = { count: 0 }
type State = Readonly<typeof initState> //??,????,???
class Count extends React.Component<IProps, State>{
    state: State = initState
    handleClick = () => {
        this.setState({
            count: this.state.count + 1
        })
    }
    render() {
        return (
            <div>
                {this.state.count}
                <button onClick={this.handleClick}>Click</button>
            </div>
        )
    }
}

ReactDom.render(<Count num={1}/>, document.getElementById('root'))
//1)?ts-loader ??typescript
//2)babel7 @babel/preset-typescript (??ts?)