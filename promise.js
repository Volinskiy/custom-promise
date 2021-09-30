
const statuses = {
  pending: "PENDING",
  fulfilled: "FULFILLED",
  rejected: "REJECTED",
}

class MyPromise {
  #status;
  #thenFn = () => {}
  #catchFn = () => {}

  constructor(fn) {
    this.statuses = statuses.pending
    return fn(this.#resolve.bind(this), this.#reject.bind(this))
  }

  #resolve(data){
    if (this.statuses === statuses.pending) {
      this.statuses = statuses.fulfilled
      setTimeout(() => {
        try {
          this.#thenFn(data)
        } catch(e) {
          this.statuses = statuses.rejected
          this.#catchFn(e)
        }
      })
    }
  }

  #reject(err) {
    if (this.statuses === statuses.pending) {
      this.statuses = statuses.rejected
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
    if (onRejected) {
      this.#catchFn = onRejected
    }
    return this.then(null, onRejected)
  }
}

const promiseTimeout = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('Done')
  }, 1000)
})

promiseTimeout
  .then((result) => {
    throw new Error('Mistake')
    console.log(result)}
  )
  .catch((err) => console.log(err.message ?? err))