import React, {
    useState, useEffect
} from "react"
import {
    useSelector,
    useDispatch
} from 'react-redux'
import $ from 'jquery'
import '../style/content.css'
import Home from './home'
import Profile from './profile'
import Schedule from './schedule'
import Graphic from './graphic'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import InputMask from 'react-input-mask'
import { validarCPF } from '../common/validarcpf'
import api from '../service/api'
import Swal from 'sweetalert2'

export default function Content() {
    const [password, setPassword] = useState("")
    const [error, setError] = useState({
        user: false,
        name: false,
        password: false,
        confirm: false,
        cpf: false,
        phone: false
    })
    const [name, setName] = useState('')
    const [passwordConfirm, setpasswordConfirm] = useState("")
    const [visiblePassword, setVisible] = useState(false)
    const [selected, setSelected] = useState('')
    const [user, setUser] = useState('')
    const [CPF, setCPF] = useState('')
    const [phone, setPhone] = useState('')
    const form = useSelector(state => state.form)
    const signup = useSelector(state => state.signup)
    const logged = useSelector(state => state.logged)
    const dispatch = useDispatch()

    useEffect(() =>{
        if(localStorage.getItem('token'))
            dispatch({ type: 'CHANGE_STATE', logged: 1 })
        else
            dispatch({ type: 'CHANGE_STATE', logged: 0 })
    }, [useSelector(state => state.token)])

    useEffect(() =>{
        if(!form) {
            $('.background_login').css('display', 'none')
            $('.login').css('display', 'none')
        } else {
            $('.background_login').css('display', 'flex')
            $('.login').css('display', 'flex')
        
            if(signup) {
                $('.login').css('height', '500px')
            } else {
                $('.login').css('height', '300px')
            }
        }
    }, [useSelector(state => state.form)])

    useEffect(() => {
        if(localStorage.getItem('selected') !== '') {
            $('#profile').css('color', 'white')
            $('#profile').css('border-color', 'black')
            $('#schedule').css('color', 'white')
            $('#schedule').css('border-color', 'black')
            $('#home').css('color', 'white')
            $('#home').css('border-color', 'black')
            $('#graphic').css('color', 'white')
            $('#graphic').css('border-color', 'black')
            $('#' + localStorage.getItem('selected')).css('color', 'rgb(255, 62, 62)')
            $('#' + localStorage.getItem('selected')).css('border-color', 'rgb(255, 62, 62)')
            setSelected('#' + localStorage.getItem('selected'))
        } else {
            $('#home').css('color', 'rgb(255, 62, 62)')
            $('#home').css('border-color', 'rgb(255, 62, 62)')
            localStorage.setItem('selected', 'home')
            setSelected('#home')
        }
    }, [logged])

    function handleForm(e) {
        e.preventDefault()
        dispatch({ type: 'CHANGE_STATE', form: 0, signup: 0 })
    }

    function handleVisible() {
        if(visiblePassword) {
            setVisible(!visiblePassword)
            $('#passwordConfirm').css('-webkit-text-security', 'disc')
            $('#password').css('-webkit-text-security', 'disc')
        } else {
            setVisible(!visiblePassword)
            $('#passwordConfirm').css('-webkit-text-security', 'none')
            $('#password').css('-webkit-text-security', 'none')
        }
    }

    function handleSelected(e) {
        e.preventDefault()
        
        if(selected) {
            $(selected).css('color', 'white')
            $(selected).css('border-color', 'black')
        } else if(localStorage.getItem('selected')) {
            $('#' + localStorage.getItem('selected')).css('color', 'white')
            $('#' + localStorage.getItem('selected')).css('border-color', 'black')
        } 

        setSelected('#' + e.target.id)
        localStorage.setItem('selected', e.target.id)
        $('#' + e.target.id).css('color', 'rgb(255, 62, 62)')
        $('#' + e.target.id).css('border-color', ' rgb(255, 62, 62)')
        return
    }

    async function handleLogin(e) {
        e.preventDefault()

        if(error.user || error.password || error.confirm || error.cpf || error.phone || error.name) {
            Swal.fire({
                icon: 'error',
                title: 'Existem campos inválidos!',
            })
            return
        }

        if(signup) {
            const data = await api.post('/user/store', {
                username: user,
                password: password,
                fullname: name,
                CPF: CPF,
                phone: phone
            })

            switch(data.data) {
                case 400:
                    Swal.fire({
                        icon: 'error',
                        title: 'Usuário já cadastrado',
                    })
                    return
                
                case 401:
                    Swal.fire({
                        icon: 'error',
                        title: 'Houve algum problema, verifique os dados!',
                    })
                    return
                
                case 402:
                    Swal.fire({
                        icon: 'error',
                        title: 'CPF inválido!',
                    })
                    return
                
                case 403:
                    Swal.fire({
                        icon: 'error',
                        title: 'CPF já cadastrado',
                    })
                    return
                
                default:
                    localStorage.setItem('token', data.data.token)
                    localStorage.setItem('username', data.data.username)
                    localStorage.setItem('admin', data.data.admin)
                    dispatch({ 
                        type: 'CHANGE_STATE', 
                        form: 0, 
                        signup: 0, 
                        token: data.data.token,
                        username: data.data.user,
                        admin: data.data.admin,
                        logged: 1
                    })
                    setName('')
                    setUser('')
                    setPassword('')
                    setpasswordConfirm('')
                    setCPF('')
                    setPhone('')
                    await Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Cadastro realizado com sucesso!',
                        showConfirmButton: false,
                        timer: 1500
                    })
            }
        } else {
            const data = await api.post('/user/login', {
                username: user,
                password: password
            })

            switch(data.data) {
                case 400: 
                    Swal.fire({
                        icon: 'error',
                        title: 'Usuário não existe!',
                    })
                    return
                
                case 401: 
                    Swal.fire({
                        icon: 'error',
                        title: 'Senha inválida!',
                    })
                    return

                default:
                    localStorage.setItem('token', data.data.token)
                    localStorage.setItem('username', data.data.username)
                    localStorage.setItem('admin', data.data.admin)
                    dispatch({ 
                        type: 'CHANGE_STATE', 
                        form: 0, 
                        signup: 0, 
                        token: data.data.token,
                        username: data.data.user,
                        admin: data.data.admin,
                        logged: 1
                    })
                    setName('')
                    setUser('')
                    setPassword('')
                    setpasswordConfirm('')
                    setCPF('')
                    setPhone('')
                    await Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'login realizado com sucesso!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    return
            }
        }
    }

    return (
        <ul className="logo">
            {localStorage.getItem('selected') === 'home' ? (
                <Home/>
            ) : (
                <></>
            )}
            {localStorage.getItem('selected') === 'schedule' ? (
                <Schedule/>
            ) : (
                <></>
            )}
            {localStorage.getItem('selected') === 'profile'? (
                <Profile/>
            ) : (
                <></>
            )}
            {localStorage.getItem('selected') === 'graphic' ? (
                <Graphic/>
            ) : (
                <></>
            )}
            <ol className="navigation">
                <li onClick={handleSelected} id="home">Home</li>
                <li onClick={handleSelected} id="schedule">Agendar</li>
                {logged ? (
                    <li onClick={handleSelected} id="profile">Perfil</li>
                ) : (
                    <></>
                )}
                {localStorage.getItem('admin') == 1 ? (
                    <li onClick={handleSelected} id="graphic">Gráfico</li>
                ) : (
                    <></>
                )}
            </ol>
            <div onClick={handleForm} className="background_login"/>
            <form className="login">
                {signup ? (
                    <h1>Cadastrar</h1>
                ) : (
                    <h1>Entrar</h1>
                )}
                <div className="user">
                    <input
                        placeholder="Usuário"
                        maxLength="30"
                        minLength="3"
                        value={user}
                        id="user"
                        onChange={(e) => {
                            setUser(e.target.value)
                        }}
                        onBlur={ () => {
                            if(user.length > 3 && user.length < 30) {
                                $('#user').css('border-color', '#ddd')
                                $('#userError').css('display', 'none')
                                setError({
                                    user: false
                                })
                            } else {
                                $('#user').css('border-color', 'red')
                                $('#userError').css('display', 'unset')
                                setError({
                                    user: true
                                })
                            }
                        }}
                    />
                    <p id="userError" className="error">*Usuário deve ter pelo menos 4 letras</p>
                </div>
                {signup ? (
                    <div className="user">
                        <input
                            placeholder="Nome Completo"
                            maxLength="30"
                            minLength="3"
                            value={name}
                            id="name"
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                            onBlur={ () => {
                                if(name.length > 3 && name.length < 30) {
                                    $('#name').css('border-color', '#ddd')
                                    $('#nameError').css('display', 'none')
                                    setError({
                                        name: false
                                    })
                                } else {
                                    $('#name').css('border-color', 'red')
                                    $('#nameError').css('display', 'unset')
                                    setError({
                                        name: true
                                    })
                                }
                            }}
                        />
                        <p id="nameError" className="error">*Nome deve ter pelo menos 4 letras</p>
                    </div>
                ) : (
                    <></>
                )}
                <div className="senhaInput">
                    <input
                        placeholder="Senha"
                        id='password'
                        className="password"
                        maxLength="30"
                        minLength="3"
                        value={password}
                        autoComplete="off"
                        onBlur={ () => {
                            if(password.length > 5 && password.length < 30) {
                                $('#password').css('border-color', '#ddd')
                                $('#passwordError').css('display', 'none')
                                setError({
                                    password: false
                                })
                            } else {
                                $('#password').css('border-color', 'red')
                                $('#passwordError').css('display', 'unset')
                                setError({
                                    password: true
                                })
                            }
                            if(password === passwordConfirm) {
                                $('#passwordConfirm').css('border-color', '#ddd')
                                $('#passwordConfirmError').css('display', 'none')
                                setError({
                                    confirm: false
                                })
                            }
                        }}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <p id="passwordError" className="error">*A senha deve ter pelo menos 6 caracteres</p>
                    <div className="senhaInput">
                    {signup ? (
                        <div className="inputSignup">
                            <input
                                placeholder="Confirmar senha"
                                className="password"
                                maxLength="30"
                                minLength="3"
                                id="passwordConfirm"
                                autoComplete="off"
                                value={passwordConfirm}
                                onChange={(e) => {
                                    setpasswordConfirm(e.target.value)
                                }}
                                onBlur={ () => {
                                    if(password === passwordConfirm) {
                                        $('#passwordConfirm').css('border-color', '#ddd')
                                        $('#passwordConfirmError').css('display', 'none')
                                        setError({
                                            confirm: false
                                        })
                                    } else {
                                        $('#passwordConfirm').css('border-color', 'red')
                                        $('#passwordConfirmError').css('display', 'unset')
                                        setError({
                                            confirm: true
                                        })
                                    }
                                }}
                            />
                            <div className="visible">
                                {!visiblePassword ? (
                                    <VisibilityOffIcon onClick={handleVisible} className="icon"/> 
                                ) : (
                                    <VisibilityIcon onClick={handleVisible} className="icon"/> 
                                )}
                            </div>
                            <p id="passwordConfirmError" className="error">*As senhas devem ser iguais</p>
                        </div>
                    ):(
                        <></>
                    )}
                    </div>
                    {signup ? (
                        <div className="user">
                            <InputMask
                                maskChar=''
                                placeholder='CPF'
                                mask='999.999.999-99'
                                value={CPF}
                                id="cpf"
                                onChange={(e) => {
                                    setCPF(e.target.value)
                                }}
                                onBlur={() => {
                                    if(validarCPF(CPF)) {
                                        $('#cpf').css('border-color', '#ddd')
                                        $('#CPFError').css('display', 'none')
                                        setError({
                                            cpf: false
                                        })
                                    } else {
                                        $('#cpf').css('border-color', 'red')
                                        $('#CPFError').css('display', 'unset')
                                        setError({
                                            cpf: true
                                        })
                                    }
                                }}
                            />
                            <p id="CPFError" className="error">*CPF inválido</p>
                            <InputMask
                                maskChar=''
                                placeholder='Telefone'
                                mask='(99) 9 9999-9999'
                                value={phone}
                                id="phone"
                                onChange={(e) => {
                                    setPhone(e.target.value)
                                }}
                                onBlur={() => {
                                    if(phone.length == 16) {
                                        $('#phone').css('border-color', '#ddd')
                                        $('#phoneError').css('display', 'none')
                                        setError({
                                            phone: false
                                        })
                                    } else {
                                        $('#phone').css('border-color', 'red')
                                        $('#phoneError').css('display', 'unset')
                                        setError({
                                            phone: true
                                        })
                                    }
                                }}
                            />
                            <p id="phoneError" className="error">*Telefone inválido</p>
                        </div>
                    ): (
                        <></>
                    )}
                    <div className="buttons_container">
                        <p onClick={handleForm}>Cancelar</p>
                        <button onClick={handleLogin}>Entrar</button>
                    </div>
                </div>
            </form>
        </ul>
    )
}