import React from 'react'
import Modal from '../../components/UI/Modal/Modal'
import useHttpErrorHandler from '../../hooks/http-error-handler'

function withErrorHandler(WrappedComponent, axios) {
  return props => {
    const [error, errorConfirmedHandler] = useHttpErrorHandler(axios)

    return (
      <React.Fragment>
        <Modal
          show={error}
          modalClosed={errorConfirmedHandler}
        >
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </React.Fragment>
    )
  }
}

export default withErrorHandler
