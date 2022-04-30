import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Container } from '@material-ui/core/Container'
//import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

export class Login extends Component {
    render() {
        return (
            <div>
                Login
            </div>
        )
    }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
