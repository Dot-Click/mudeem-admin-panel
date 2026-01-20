import React from 'react'

const DeleteUserProfile = () => {
    return (
        <div className='d-flex justify-content-center align-items-center delete-profile-bg' style={{ height: "100vh" }} >
            <div className='bg-white p-10 radius-10' style={{ width: "460px" }}>
                <div>
                    <div className='d-flex justify-content-between align-items-center'>
                        <p className='mb-0 fw-bolder text-danger' style={{ fontSize: "26px" }}>Profile</p>
                        <button type="button"
                            className="btn btn-outline-success-600 radius-8 px-20 py-11">Logout</button>
                    </div>
                    <div className='d-flex align-items-center gap-10'>
                        <img alt="" width={80} height={80} src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.2038776791.1724095678&semt=ais_hybrid" />
                        <div>
                            <p className='mb-0 text-lg'>user name</p>
                            <p className='mb-0'>user email</p>
                        </div>
                    </div>

                </div>
                <p className='mb-0 mt-40 fw-bolder text-danger text-center' style={{ fontSize: "26px" }}>Delete Account</p>
                <p className='text-center my-20'>Are you sure you want to delete your account? This action is irreversible and will permanently remove all your data.</p>

                <button type="button"
                    className="btn btn-danger-600 radius-8 w-100 px-20 py-11">Delete Account</button>
            </div>
        </div>
    )
}

export default DeleteUserProfile