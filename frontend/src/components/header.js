import React, {
    useState,
    useEffect
} from 'react'
import {
    useDispatch,
    useSelector
} from 'react-redux'
import '../style/header.css'
import Swal from 'sweetalert2'

export default function Header() {
    const [login, setLogin] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        if(localStorage.getItem('token')) {
            setLogin(false)
        } else {
            setLogin(true)
        }
    }, [useSelector(state => state.token)])

    function handleEntrar(e) {
        e.preventDefault()
        dispatch({ type: 'CHANGE_STATE', form: 1, signup: 0 })
    }

    function handleCadastrar(e) {
        e.preventDefault()
        dispatch({ type: 'CHANGE_STATE', form: 1, signup: 1 })
    }

    function handleSair(e) {
        e.preventDefault()

        Swal.fire({
            title: 'Tem certeza que deseja sair?',
            icon: 'warning',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonColor: 'green',
            confirmButtonText: `Confirmar`,
            denyButtonText: `Cancelar`,
            denyButtonColor: 'red'
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                localStorage.setItem('token', '')
                localStorage.setItem('username', '')
                localStorage.setItem('admin', '')
                localStorage.setItem('selected', 'home')
                dispatch({ 
                    type: 'CHANGE_STATE', 
                    form: 0, 
                    signup: 0, 
                    token: '',
                    username: '',
                    admin: 0,
                    logged: 0
                })
                setLogin(true)
            }
            return
        })
    }

    return (
        <ul className="header">
            {login ? (
                <li onClick={handleEntrar}>Entrar</li>
            ): (
                <div>
                    <p id="username">Bem vindo {localStorage.getItem('username')}</p>
                    {localStorage.getItem('admin') == 1 ? (
                        <p className="admin">ADMIN</p>
                    ) : (
                        <></>
                    )}  
                </div> 
            )}
            {login ? (
                <li onClick={handleCadastrar}>Cadastrar</li>
            ): (
                <li onClick={handleSair}>Sair</li>
            )}
        </ul>
    )
}