import React, { Component } from 'react';

class Search extends Component {
    render() {
        const { value, onChange } = this.props;
        return (
            <div>
                <form>
                    <input value={value} 
                        type="text"
                        onChange={onChange}
                    />
                </form>
            </div>
        );
    }
}

export default Search;
