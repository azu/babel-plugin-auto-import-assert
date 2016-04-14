"use strict";
module.exports = function ({types: t}) {
    const AssertDefaultImport = t.importDefaultSpecifier(t.identifier('assert'));

    function AssertImport() {
        let declare = t.importDeclaration(
            [AssertDefaultImport],
            t.stringLiteral('assert')
        );
        declare._blockHoist = 3;

        return declare;
    }

    function addAssertImport(file) {
        file.path.unshiftContainer('body', AssertImport())
    }


    function isRequireAssert(callee, arg) {
        if (!callee.isIdentifier() || !callee.equals("name", "require")) {
            return false;
        }
        return (arg.isLiteral() && arg.equals("value", "assert"));
    }

    return {
        visitor: {
            AssignmentExpression: {
                enter: function (nodePath, state) {
                    if (!nodePath.equals("operator", "=")) {
                        return;
                    }
                    var left = nodePath.get("left");
                    if (!left.isIdentifier()) {
                        return;
                    }
                    if (!left.equals("name", "assert")) {
                        return;
                    }
                    var right = nodePath.get("right");
                    if (!right.isCallExpression()) {
                        return;
                    }
                    var callee = right.get("callee");
                    var arg = right.get("arguments")[0];
                    if (isRequireAssert(callee, arg)) {
                        state.set("__AUTO_IMPORT_ASSERT_Already_imported", true)
                    }
                }
            },
            VariableDeclarator: {
                enter: function (nodePath, state) {
                    var id = nodePath.get("id");
                    if (!id.isIdentifier()) {
                        return;
                    }
                    if (!id.equals("name", "assert")) {
                        return;
                    }
                    var init = nodePath.get("init");
                    if (!init.isCallExpression()) {
                        return;
                    }
                    var callee = init.get("callee");
                    var arg = init.get("arguments")[0];
                    if (isRequireAssert(callee, arg)) {
                        state.set("__AUTO_IMPORT_ASSERT_Already_imported", true)
                    }
                }
            },
            ImportDeclaration: {
                enter: function (nodePath, state) {
                    var source = nodePath.get("source");
                    if (!(source.equals("value", "assert"))) {
                        return;
                    }
                    var firstSpecifier = nodePath.get("specifiers")[0];
                    if (!firstSpecifier.isImportDefaultSpecifier()) {
                        return;
                    }
                    var local = firstSpecifier.get("local");
                    if (!(local.equals("name", "assert"))) {
                        return;
                    }
                    state.set("__AUTO_IMPORT_ASSERT_Already_imported", true)
                }
            },
            Program: {
                exit: function (path, state) {
                    const isAlreadyImported = state.get("__AUTO_IMPORT_ASSERT_Already_imported");
                    if (isAlreadyImported) {
                        return
                    }
                    addAssertImport(state.file);
                }
            }
        }
    };
};