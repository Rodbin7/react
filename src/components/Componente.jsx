import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./componente.css";

const DEFAULT_QUERY = "redux";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const isSearched = (searchTerm) => (item) => !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

const Search = ({ value, onChange, children }) => 
	<form>
		{children} <input value={value} 
			type="text"
			onChange={onChange}
		/>
	</form>

const Button = ({ onClick, className = "", children }) =>
	<button onClick={onClick} className={className} type="button">
		{children}
	</button>
		

const Table = ({ list, pattern, onDismiss }) => 
	<div className="table">
		{list.filter(isSearched(pattern)).map(item => 
			<div key={item.objectID} className="table-row">
				<span style={{ width: "40%" }}>
					<a href={item.url}>{item.title}</a>
				</span>
				<span style={{width: '30%'}}>{item.author}</span>
				<span style={{ width: '10%' }}>{item.num_comments}</span>
				<span style={{ width: '10%'}}>{item.points}</span>
				<span style={{ width: '10%' }}>
					<Button className="button-inline" onClick={() => onDismiss(item.objectID)} type="button">
							Dismiss
					</Button>
				</span>
			</div>
		)}
	</div>

class Componente extends Component {
	constructor(props) {
		super(props);
		this.state = {
				result: null,
				searchTerm: DEFAULT_QUERY,
		};
		this.onDismiss = this.onDismiss.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.setSearchTopStories = this.setSearchTopStories.bind(this);
		this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
}

	setSearchTopStories(result) {
		this.setState({ result });
	};
	fetchSearchTopStories(searchTerm) {
		fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
			.then(response => response.json())
			.then(result => this.setSearchTopStories(result))
			.catch(error => error);
	};
	componentDidMount() {
		const { searchTerm } = this.state;
		this.fetchSearchTopStories(searchTerm);
	};

	onSearchChange(event) {
		this.setState({ searchTerm: event.target.value });
	}
	onDismiss(id) {
		const isNotId = item => item.objectID !== id;
		const updatedList = this.state.list.filter(isNotId);
		this.setState({ list: updatedList });
	};
    
  render() {
    const { searchTerm, result } = this.state;
	if (!result) { return null; }
    return (
			<div className="page">
				<div className="interactions">
				<Search 
					value={searchTerm} 
					onChange={this.onSearchChange}
				>
					Search
				</Search>
				</div>
				<Table 
					list={result.hits}
					pattern={searchTerm}
					onDismiss={this.onDismiss}
				></Table>
			</div>
    );
  }
}

export default Componente;