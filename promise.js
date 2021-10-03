
const statuses = {
  pending: "PENDING",
  fulfilled: "FULFILLED",
  rejected: "REJECTED",
}

class MyPromise {
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('Argument in MyPromise constructor is not a function')
    }
    this.#status = statuses.pending
    try {
      return fn(this.#resolve.bind(this), this.#reject.bind(this))
    } catch(e) {
      this.#reject.bind(this)(e)
    }
  }
  
  #status
  #deferred = []
  #value
  
  #handle() {
    if (this.#status === statuses.rejected && this.#deferred.length === 0) {
      console.log("Unhandled promise rejection", this.#value);
    }

    this.#deferred.forEach((deferred) => {
      setTimeout(() => {
        const callback = this.#status === statuses.fulfilled ? deferred.onResolved : deferred.onRejected
        if (callback === null) {
          if (this.#status === statuses.fulfilled) {
            this.#resolve.bind(deferred.promise)(this.#value)
          } else {
            this.#reject.bind(deferred.promise)(this.#value)
          }
          return
        }

        let result
        try {
          result = callback(this.#value)
        } catch(e) {
          this.#reject.bind(deferred.promise)(e)
        }
        this.#resolve.bind(deferred.promise)(result)
      }, 0)
    })
  }

  #resolve(data){
    if (this.#status === statuses.pending) {
      this.#status = statuses.fulfilled
      this.#value = data
      this.#handle()
    }
  }

  #reject(err) {
    if (this.#status === statuses.pending) {
      this.#status = statuses.rejected
      this.#value = err
      this.#handle()
    }
  }

  then(onResolved, onRejected) {
    const promise = new this.constructor(() => {})
    this.#deferred.push({
      onResolved: typeof onResolved === 'function' ? onResolved : null,
      onRejected: typeof onRejected === 'function' ? onRejected : null,
      promise
    })
    return promise
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
  .then(() => {
    console.log('Step 2')
    throw new Error('Вызвано исключение')
  })
  .catch((err) => {
    console.log(err.message ?? err)
  })