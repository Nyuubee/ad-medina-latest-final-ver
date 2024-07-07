
export default roleHandler(['admin'], async (event) => {
    await addConfigOrDoNothing()
})
