import React, {
    useState,
    useEffect
} from 'react'
import {
    useSelector,
    useDispatch
} from 'react-redux'
import '../style/profile.css'
import $ from 'jquery'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import InputMask from 'react-input-mask'
import api from '../service/api'
import Swal from 'sweetalert2'

export default function Profile() {
    const [user, setUser] = useState('')
    const [CPF, setCPF] = useState('')
    const [phone, setPhone] = useState('')
    const [name, setName] = useState('')
    const [visiblePassword, setVisible] = useState(false)
    const [passwordConfirm, setpasswordConfirm] = useState('')
    const [password, setPassword] = useState('asdasdasdasd')
    const [error, setError] = useState({
        password: false,
        confirm: false,
        phone: false
    })
    const [editar, setEditar] = useState(true)
    const [buttonLabel, setButton] = useState('Editar')
    const [updated, setUpdate] = useState(false)
    const dispatch = useDispatch() 

    async function loadData() {
        const data = await api.post('/user/showOne', {
            username: localStorage.getItem('username')
        })

        return data.data
    }

    function handleCancel(e) {
        e.preventDefault()

        setEditar(true)
        $('#password').css('border-color', '#ddd')
        $('#passwordError').css('display', 'none')
        setPassword(password || 'asdasdasdasd')
        setButton('Editar')
    }

    function handleEditar(e) {
        e.preventDefault()

        if(password == 'asdasdasdasd')
            setPassword('')
        
        if(!editar) {
            if(error.phone) {
                Swal.fire({
                    icon: 'error',
                    title: 'Telefone inválidos!',
                })
                return
            }

            Swal.fire({
                title: 'Tem certeza que deseja salvar?',
                icon: 'warning',
                showConfirmButton: true,
                showDenyButton: true,
                confirmButtonColor: 'green',
                confirmButtonText: `Confirmar`,
                denyButtonText: `Cancelar`,
                denyButtonColor: 'red'
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    const data = await api.post('/user/showOne', {
                        username: user
                    }).data
    
                    if(data == 400) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Ocorreu algum problema',
                        })
                    }
    
                    const update = await api.put('/user/update', {
                        username: user,
                        password: password,
                        phone: phone
                    })
    
                    if(update.data == 400) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Ocorreu algum problema',
                        })
                    } 
    
                    setUpdate(!updated)

                    if(update.data.token) {
                        localStorage.setItem('token', update.data.token)
    
                        dispatch({ 
                            type: 'CHANGE_STATE', 
                            token: update.data.token,
                        })
                    }
                }
                Swal.fire({
                    icon: 'success',
                    title: 'Alterações realizadas com sucesso!',
                })
                $('#password').css('border-color', '#ddd')
                $('#passwordError').css('display', 'none')
                setPassword(password || 'asdasdasdasd')
                setEditar(true)
                setButton('Editar')
                return
            })
        }
        
        
        setEditar(false)   
        setButton('Salvar')
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

    useEffect(async () =>{
        if(localStorage.getItem('username')) {
            const data = await loadData()
            if(data) {
                setUser(data.username)
                setCPF(data.CPF)
                setName(data.fullname)
                setPhone(data.phone)
            }
        }
    }, [updated])

    return (
        <div className="profile">
            <form>
                <div className="user">
                    <p>Usuário:</p>
                    <input
                        maxLength="30"
                        minLength="3"
                        value={user}
                        id="user"
                        disabled={true}
                    />
                    <p>Senha:</p>
                    <input
                        id='password'
                        className="password"
                        maxLength="30"
                        minLength="3"
                        value={password}
                        disabled={editar}
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
                    {editar ? (
                        <></>
                    ) : (
                        <div className="inputSignup">
                            <p>Confirmar Senha:</p>
                            <input
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
                                        $('.profile>form>.user>.inputSignup>.visible').css('bottom', 2)
                                        setError({
                                            confirm: false
                                        })  
                                    } else {
                                        $('#passwordConfirm').css('border-color', 'red')
                                        $('#passwordConfirmError').css('display', 'unset')
                                        $('.profile>form>.user>.inputSignup>.visible').css('bottom', 21)
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
                    )}
                </div>
                <div className="user">
                    <p>Nome Completo:</p>
                    <input
                            maxLength="30"
                            minLength="3"
                            value={name}
                            disabled={true}
                            id="name"
                        />
                    <p>CPF:</p>
                    <InputMask
                        maskChar=''
                        mask='999.999.999-99'
                        value={CPF}
                        id="cpf"
                        disabled={true}
                    />
                    <p id="CPFError" className="error">*CPF inválido</p>
                    <p>Telefone:</p>
                    <InputMask
                        maskChar=''
                        mask='(99) 9 9999-9999'
                        value={phone}
                        id="phone"
                        disabled={editar}
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
                    <div className="buttons_container">
                        {editar ? (
                            <></>
                        ) : (
                            <p onClick={handleCancel}>Cancelar</p>
                        )}
                        <button onClick={handleEditar}>{buttonLabel}</button>
                    </div>
                </div>
            </form>
        </div>
    )
}