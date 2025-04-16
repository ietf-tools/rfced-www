import ts from 'typescript'

// export function checkTypes(filePaths: string[]) {
//   const host = ts.createCompilerHost({})

//   const program = ts.createProgram(filePaths, {}, host)

//   const diagnostics = ts.getPreEmitDiagnostics(program)
//   const errors = diagnostics.filter(
//     (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error
//   )

//   if (errors.length > 0) {
//     console.error('Type checking failed:')
//     errors.forEach((error) => {
//       console.error(ts.flattenDiagnosticMessageText(error.messageText, '\n'))
//     })
//   }
// }
