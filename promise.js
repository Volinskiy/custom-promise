
const statuses = {
  pending: "PENDING",
  fulfilled: "FULFILLED",
  rejected: "REJECTED",
}

class MyPromise {
  constructor(fn) {
    this.#status = statuses.pending
    return fn(this.#resolve.bind(this), this.#reject.bind(this))
  }
  
  #status
  #thenFn = () => {}
  #catchFn = () => {}

  #resolve(data){
    if (this.#status === statuses.pending) {
      this.#status = statuses.fulfilled
      setTimeout(() => {
        try {
          this.#thenFn(data)
        } catch(e) {
          this.#status = statuses.rejected
          this.#catchFn(e)
        }
      })
    }
  }

  #reject(err) {
    if (this.#status === statuses.pending) {
      this.#status = statuses.rejected
      setTimeout(() => {
        this.#catchFn(err)
      })
    }
  }

  then(onResolved, onRejected) {
    if (onResolved) {
      this.#thenFn = onResolved
    }
    if (onRejected) {
      this.#catchFn = onRejected
    }
    return this
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }
}

const promiseTimeout = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('Done')
    reject('reject')
  }, 1000)
})

promiseTimeout
  .then((result) => {
    // throw new Error('Mistake')
    console.log(result)}
  )
  .catch((err) => console.log(err.message ?? err))