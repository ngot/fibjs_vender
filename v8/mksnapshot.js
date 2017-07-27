var fs = require('fs');
var platform = process.platform;

var folders = {
    'linux': 'Linux',
    'darwin': 'Darwin',
    'win32': 'Windows'
}

var fname = {
    'amd64': 'x64',
    'i386': 'ia32',
    'arm': 'arm',
    'arm64': 'arm64'
}

function build_posix() {
    process.chdir('../..');

    function build_one(arch) {
        process.run('sh', [
            'build',
            arch,
            '-j'
        ]);

        process.run('bin/' + folders[platform] + '_' + arch + '_release/fibjs', ['test/vm_test/build_jsc.js']);
        process.run('bin/' + folders[platform] + '_' + arch + '_release/v8_test');

        fs.unlink('vender/v8/src/snapshot/snapshots/snapshot-' + fname[arch] + '.cc');
        fs.rename('snapshot-' + fname[arch] + '.cc', 'vender/v8/src/snapshot/snapshots/snapshot-' + fname[arch] + '.cc');
    }

    function build_remote(arch) {
        process.run('sh', [
            'build',
            arch,
            '-j'
        ]);

        process.run('scp', [
            'bin/' + folders[platform] + '_' + arch + '_release/fibjs',
            arch + ':~/fibjs'
        ]);

        process.run('scp', [
            'test/vm_test/build_jsc.js',
            arch + ':~/build_jsc.js'
        ]);

        process.run('ssh', [
            arch,
            './fibjs',
            'build_jsc.js'
        ]);

        process.run('scp', [
            'bin/' + folders[platform] + '_' + arch + '_release/v8_test',
            arch + ':~/v8_test'
        ]);

        process.run('ssh', [
            arch,
            './v8_test'
        ]);

        process.run('scp', [
            arch + ':~/jsc_test_' + fname[arch] + '.jsc',
            'test/vm_test/jsc_test_' + fname[arch] + '.jsc'
        ]);

        process.run('scp', [
            arch + ':~/snapshot-' + fname[arch] + '.cc',
            'vender/v8/src/snapshot/snapshots/snapshot-' + fname[arch] + '.cc'
        ]);
    }

    build_one("amd64");
    build_one("i386");

    if (platform === 'linux') {
        build_remote("arm64");
        build_remote("arm");
    }
}

function build_win() {
    process.chdir('../..');

    function build_one(arch) {
        process.run('build.cmd', [
            arch
        ]);

        process.run('bin/' + folders[platform] + '_' + arch + '_release/v8_test.exe');

        fs.unlink('vender/v8/src/snapshot/snapshots/snapshot-' + fname[arch] + '-win.cc');
        fs.rename('snapshot-' + fname[arch] + '-win.cc', 'vender/v8/src/snapshot/snapshots/snapshot-' + fname[arch] + '-win.cc');
    }

    build_one("amd64");
    build_one("i386");
}

if (platform == 'win32')
    build_win();
else
    build_posix();